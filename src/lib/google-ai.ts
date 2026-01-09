// // src/lib/google-ai.ts
// import { GoogleGenAI } from "@google/genai";

// // Ensure your API Key is in .env.local
// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// export async function generateImage(prompt: string, brandStyle: string) {
//   try {
//     const modelName = "imagen-4.0-generate-001";

//     console.log(`Calling Google AI with model: ${modelName}`);

//     const fullPrompt = `Professional product shot of ${prompt}.
//                         Style: ${brandStyle}.
//                         High resolution, 4k, studio lighting.`;

//     // 1. Generate Images
//     const response = await genAI.models.generateImages({
//       model: modelName,
//       prompt: fullPrompt,
//       config: {
//         numberOfImages: 1,
//       },
//     });

//     // 2. Extract the Image
//     const generatedImage = response.generatedImages?.[0];

//     // --- FIX IS HERE ---
//     // The property is named 'imageBytes', not 'base64'
//     if (generatedImage?.image?.imageBytes) {
//       return generatedImage.image.imageBytes;
//     }

//     console.log("Unexpected Response:", JSON.stringify(response, null, 2));
//     throw new Error(
//       "Image generated, but could not find 'imageBytes' in response."
//     );
//   } catch (error: any) {
//     console.error("AI Gen Error:", error);
//     throw error;
//   }
// }

// src/lib/google-ai.ts
export async function generateImage(prompt: string, brandStyle: string) {
  console.log("MOCK MODE: Simulating AI generation...");

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // --- FIX IS HERE ---
  // We added "data:image/png;base64," to the start.
  // This tells the browser: "Treat this text string as a PNG image"
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
}
