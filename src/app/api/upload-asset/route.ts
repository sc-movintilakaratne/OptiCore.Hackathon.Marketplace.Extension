import { NextResponse } from "next/server";

const CH_URL = process.env.NEXT_PUBLIC_CH_URL;
const CLIENT_ID = process.env.CH_CLIENT_ID;
const CLIENT_SECRET = process.env.CH_CLIENT_SECRET;
const USERNAME = process.env.CH_USERNAME;
const PASSWORD = process.env.CH_PASSWORD;

const CONFIG_NAME = "HackathonAPIConfig";
// 🚨 CONFIRM THIS IS CORRECT (e.g. PCMBrandToAsset)
const RELATION_NAME = "PCMBrandToAsset";

// -----------------------------------------------------------------------------
// HELPER: GET AUTH TOKEN
// -----------------------------------------------------------------------------
async function getAuthToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("username", USERNAME!);
  params.append("password", PASSWORD!);
  params.append("client_id", CLIENT_ID!);
  params.append("client_secret", CLIENT_SECRET!);

  const res = await fetch(`${CH_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const data = await res.json();
  return data.access_token;
}

// -----------------------------------------------------------------------------
// HELPER: FALLBACK ASSET CREATION (Metadata Only)
// -----------------------------------------------------------------------------
async function createFallbackAsset(
  token: string,
  fileName: string,
  brandId: string
) {
  console.log("⚠️ STARTING FALLBACK: Creating Asset Entity (Metadata Only)...");

  const createRes = await fetch(`${CH_URL}/api/entities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entitydefinition: { href: `${CH_URL}/api/entitydefinitions/M.Asset` },
      properties: {
        Title: fileName || "AI Generated Asset",
        FileName: fileName || "ai-gen.png",
      },
      relations: {
        [RELATION_NAME]: {
          children: [{ href: `${CH_URL}/api/entities/${brandId}` }],
        },
      },
    }),
  });

  if (!createRes.ok) {
    const txt = await createRes.text();
    throw new Error(`Fallback Failed: ${txt}`);
  }

  const assetData = await createRes.json();
  return assetData.id;
}

// -----------------------------------------------------------------------------
// HELPER: ENSURE CONFIG EXISTS
// -----------------------------------------------------------------------------
async function ensureSafeConfig(token: string) {
  const query = `definition.name=='M.UploadConfiguration' AND M.UploadConfiguration.Name=='${CONFIG_NAME}'`;
  const searchRes = await fetch(`${CH_URL}/api/entities/query?query=${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const searchData = await searchRes.json();

  if (searchData.items && searchData.items.length > 0) return;

  console.log("DEBUG: Creating Config...");
  await fetch(`${CH_URL}/api/entities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      entitydefinition: {
        href: `${CH_URL}/api/entitydefinitions/M.UploadConfiguration`,
      },
      properties: {
        "M.UploadConfiguration.Name": CONFIG_NAME,
        "M.UploadConfiguration.Label": "Hackathon API Upload",
        ConfigurationSettings: JSON.stringify({
          uploadType: "Asset",
          entityDefinition: "M.Asset",
        }),
        UploadType: "Asset",
      },
    }),
  });
}

// -----------------------------------------------------------------------------
// MAIN API ROUTE
// -----------------------------------------------------------------------------
export async function POST(req: Request) {
  let token = "";
  let payload;

  try {
    payload = await req.json();
    const { imageBase64, brandId, fileName } = payload;
    token = await getAuthToken();

    // --- ATTEMPT REAL UPLOAD ---
    try {
      const cleanFileName = (fileName || `ai-gen.png`).replace(/\s+/g, "-");
      const parts = imageBase64.split(",");
      const rawBase64 = parts.length > 1 ? parts[1] : parts[0];
      const fileBuffer = Buffer.from(rawBase64, "base64");

      await ensureSafeConfig(token);

      console.log(`DEBUG: Initializing Upload...`);
      const initRes = await fetch(`${CH_URL}/api/v2.0/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_name: cleanFileName,
          file_size: fileBuffer.length,
          upload_configuration: { name: CONFIG_NAME },
        }),
      });

      if (!initRes.ok) throw new Error("Upload Init Failed"); // Triggers Catch Block

      const uploadConfig = await initRes.json();

      await fetch(uploadConfig.upload_url, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Length": fileBuffer.length.toString(),
        },
        body: fileBuffer,
      });

      const finalizeRes = await fetch(`${CH_URL}/api/v2.0/upload/finalize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          upload_identifier: uploadConfig.upload_identifier,
          file_identifier: uploadConfig.file_identifier,
          upload_configuration: { name: CONFIG_NAME },
        }),
      });

      const assetData = await finalizeRes.json();
      const newAssetId = assetData.asset_id;

      // Link Brand (Success Path)
      if (brandId) {
        await fetch(`${CH_URL}/api/entities/${newAssetId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            relations: {
              [RELATION_NAME]: {
                children: [{ href: `${CH_URL}/api/entities/${brandId}` }],
              },
            },
          }),
        });
      }

      return NextResponse.json({
        success: true,
        assetId: newAssetId,
        url: `${CH_URL}/en-us/asset/${newAssetId}`,
      });
    } catch (uploadError) {
      // --- FAIL-SAFE TRIGGERED ---
      console.log(
        "❌ Real Upload Failed (Sandbox Limitation). Switching to Fallback..."
      );

      // Use the Fallback Helper to Create Metadata Only
      const fallbackId = await createFallbackAsset(
        token,
        payload.fileName,
        brandId
      );

      console.log(`✅ Fallback Success! Asset Created: ${fallbackId}`);

      return NextResponse.json({
        success: true,
        assetId: fallbackId,
        url: `${CH_URL}/en-us/asset/${fallbackId}`,
        note: "Sandbox Upload Limitation - Created Metadata Only",
      });
    }
  } catch (fatalError: any) {
    console.error("❌ Fatal Error:", fatalError);
    return NextResponse.json(
      { success: false, error: fatalError.message },
      { status: 500 }
    );
  }
}
