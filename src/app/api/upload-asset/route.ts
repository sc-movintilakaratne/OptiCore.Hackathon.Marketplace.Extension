// src/app/api/upload-asset/route.ts
import { NextResponse } from "next/server";

// -----------------------------------------------------------------------------
// CONFIGURATION (Add these to your .env.local)
// -----------------------------------------------------------------------------
const CH_URL = process.env.NEXT_PUBLIC_CH_URL;
const CLIENT_ID = process.env.CH_CLIENT_ID;
const CLIENT_SECRET = process.env.CH_CLIENT_SECRET;
const USERNAME = process.env.CH_USERNAME;
const PASSWORD = process.env.CH_PASSWORD;

// Helper: Authenticate and get Token
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
  if (!res.ok) throw new Error(`Auth Failed: ${data.error_description}`);
  return data.access_token;
}

export async function POST(req: Request) {
  try {
    const { imageBase64, brandId, fileName } = await req.json();
    const token = await getAuthToken();

    // -------------------------------------------------------------------------
    // STEP 1: PREPARE THE FILE
    // -------------------------------------------------------------------------
    // Convert Base64 to a Buffer (Binary)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const fileBuffer = Buffer.from(base64Data, "base64");

    // -------------------------------------------------------------------------
    // STEP 2: REQUEST UPLOAD (Ask CH where to put the file)
    // -------------------------------------------------------------------------
    // -------------------------------------------------------------------------
    // STEP 2: REQUEST UPLOAD (Ask CH where to put the file)
    // -------------------------------------------------------------------------
    console.log("DEBUG: Requesting Upload URL from Sitecore...");

    const initRes = await fetch(`${CH_URL}/api/v2.0/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file_name: fileName || `ai-gen-${Date.now()}.png`,
        file_size: fileBuffer.length,
        upload_configuration: { name: "AssetUploadConfiguration" },
      }),
    });

    // --- NEW DEBUGGING BLOCK ---
    if (!initRes.ok) {
      const errorText = await initRes.text();
      console.error(" Sitecore Upload Error:", initRes.status, errorText);
      throw new Error(
        `Sitecore Refused Upload: ${initRes.status} ${errorText}`
      );
    }
    // ---------------------------

    const uploadConfig = await initRes.json();
    if (!uploadConfig.upload_url)
      throw new Error(
        "Failed to get upload URL (Response was 200 but missing URL)"
      );
    // -------------------------------------------------------------------------
    // STEP 3: PERFORM UPLOAD (Push bytes to Azure Blob)
    // -------------------------------------------------------------------------
    // Note: This request goes to Azure, NOT Content Hub, so no Auth header needed usually
    await fetch(uploadConfig.upload_url, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": "image/png",
      },
      body: fileBuffer,
    });

    // -------------------------------------------------------------------------
    // STEP 4: FINALIZE UPLOAD (Tell CH "I'm done, create the asset")
    // -------------------------------------------------------------------------
    const finalizeRes = await fetch(`${CH_URL}/api/v2.0/upload/finalize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        upload_identifier: uploadConfig.upload_identifier,
        file_identifier: uploadConfig.file_identifier,
        upload_configuration: { name: "AssetUploadConfiguration" },
      }),
    });

    const finalizeData = await finalizeRes.json();
    const newAssetId = finalizeData.asset_id;

    if (!newAssetId)
      throw new Error("Upload finalized but no Asset ID returned");

    // -------------------------------------------------------------------------
    // STEP 5: LINK TO BRAND (The crucial part!)
    // -------------------------------------------------------------------------
    // We update the new Asset to add a relation to the selected Brand ID

    // NOTE: You must check your Schema for the exact relation name.
    // Common names: "PCMBrandToAsset", "BrandToAsset", "M.Brand.ToAsset"
    const RELATION_NAME = "PCMBrandToAsset";

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

    return NextResponse.json({
      success: true,
      assetId: newAssetId,
      url: `${CH_URL}/en-us/assets/${newAssetId}`,
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
