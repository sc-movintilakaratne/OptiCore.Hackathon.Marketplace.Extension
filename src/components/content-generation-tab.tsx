"use client";

import React, { useState } from "react";

// Define the shape of our API response
interface ApiResponse {
  success: boolean;
  assetId?: string;
  imagePreview?: string;
  error?: string;
}

export default function ContentGenerationTab() {
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [assetId, setAssetId] = useState<string | null>(null);

  // Form State
  const [brandName, setBrandName] = useState("Nike");
  const [description, setDescription] = useState("");

  const handleGenerate = async () => {
    if (!description) return alert("Please enter a description");

    setLoading(true);
    setGeneratedImage(null); // Reset previous image
    setAssetId(null);

    try {
      const res = await fetch("/api/generate-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          productDescription: description,
        }),
      });

      const data = (await res.json()) as ApiResponse;

      if (!data.success) {
        throw new Error(data.error || "Generation failed");
      }

      setGeneratedImage(data.imagePreview!);
      setAssetId(data.assetId!);
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Section - Sticky top if needed */}
      <div className="px-4 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </span>
          AI Asset Studio
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Generate & upload brand assets in seconds.
        </p>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Step 1: Context */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 block">
            1. Brand Context
          </label>
          <div className="relative">
            <select
              className="w-full pl-3 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all appearance-none"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            >
              <option value="Nike">Nike (Sporty, Energetic)</option>
              <option value="Patagonia">Patagonia (Nature, Earthy)</option>
              <option value="Apple">Apple (Minimalist, Clean)</option>
              <option value="Coca-Cola">Coca-Cola (Vibrant, Red)</option>
            </select>
            {/* Custom Arrow Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Step 2: Prompt */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 block">
            2. Product Vision
          </label>
          <textarea
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all min-h-[120px] resize-none"
            placeholder="Describe the scene... e.g. A futuristic running shoe floating on a neon track"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Result Area (Only shows when active) */}
        {(loading || generatedImage) && (
          <div className="mt-6 border-t border-gray-100 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <label className="text-sm font-semibold text-gray-700 block mb-3">
              {loading ? "Generating Result..." : "3. Generated Asset"}
            </label>

            <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm min-h-[200px] flex flex-col items-center justify-center">
              {loading && (
                <div className="text-center p-6 space-y-3">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-r-transparent"></div>
                  <p className="text-xs text-gray-500 font-medium">
                    AI is processing...
                  </p>
                </div>
              )}

              {generatedImage && !loading && (
                <>
                  <img
                    src={generatedImage}
                    alt="AI Result"
                    className="w-full h-auto object-cover"
                  />
                  {/* Overlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-white/95 backdrop-blur-sm border border-green-100 p-3 rounded-lg shadow-lg flex items-start gap-3">
                      <div className="bg-green-100 p-1 rounded-full text-green-600 mt-0.5">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          Upload Complete
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                          ID: {assetId}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10">
        <button
          onClick={handleGenerate}
          disabled={loading || !description}
          className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold shadow-sm transition-all transform active:scale-[0.98]
            ${
              loading || !description
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
            }`}
        >
          {loading ? "Processing..." : "Generate Asset"}
        </button>
      </div>
    </div>
  );
}
