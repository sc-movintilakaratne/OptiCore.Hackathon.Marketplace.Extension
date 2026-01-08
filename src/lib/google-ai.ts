// src/lib/google-ai.ts
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateImage(prompt: string, brandStyle: string) {
  try {
    const modelName = "imagen-3.0-generate-001";

    const fullPrompt = `Professional product shot of ${prompt}. 
                        Style: ${brandStyle}. 
                        High resolution, 4k, studio lighting.`;

    const result = await genAI.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
      config: {
        // @ts-ignore
        sampleCount: 1,
      },
    });

    const candidate = result.candidates?.[0];
    const imagePart = candidate?.content?.parts?.[0];

    if (imagePart?.inlineData?.data) {
      return imagePart.inlineData.data;
    }

    throw new Error(
      "No image generated. The model might have returned text instead."
    );
  } catch (error) {
    console.error("AI Gen Error:", error);
    throw error;
  }
}
