// src/app/api/generate-asset/route.ts
import { NextResponse } from "next/server";
import { generateImage } from "@/src/lib/google-ai";
// import { uploadAsset } from "@/src/lib/content-hub";

export async function POST(request: Request) {
  try {
    const { brandName, productDescription } = await request.json();

    if (!brandName || !productDescription) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Generate Image (Google AI)
    console.log(`Generating image for ${brandName}...`);
    const base64Image = await generateImage(productDescription, brandName);

    // 2. Upload to Content Hub
    // We create a unique filename so assets don't overwrite each other
    // const uniqueId = Date.now();
    // const cleanBrand = brandName.replace(/[^a-zA-Z0-9]/g, "");
    // const fileName = `AI-Gen-${cleanBrand}-${uniqueId}.png`;

    // console.log("Uploading to Content Hub...");
    // const assetId = await uploadAsset(base64Image, fileName);

    // <--- 3. CREATE A FAKE ASSET ID FOR TESTING
    const assetId = "TEST-MODE-SKIPPED-UPLOAD";

    // 3. Return Success
    return NextResponse.json({
      success: true,
      assetId: assetId,
      // We send the image back so the user sees it immediately without waiting for CH processing
      imagePreview: `data:image/png;base64,${base64Image}`,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
