import axiosClient from "@/src/config/axiosClient";
import { updatePageFieldType } from "@/src/types/types";

/**
 * Updates a specific field on a Sitecore page
 * Uses PATCH to partially update the page
 */
export const updatePageField = async ({
  token,
  pageId,
  fieldName,
  fieldValue,
  language = "en",
  version = "1",
}: updatePageFieldType) => {
  const query = new URLSearchParams({
    language,
    version,
  }).toString();

  try {
    // Map SEO field names to Sitecore field names
    // These field names may need to be adjusted based on your Sitecore schema
    const fieldMapping: Record<string, string> = {
      title: "title",
      metaDescription: "metaDescription",
      metaKeywords: "metaKeywords",
      ogTitle: "ogTitle",
      ogDescription: "ogDescription",
      ogImage: "ogImage",
      ogUrl: "ogUrl",
    };

    const sitecoreFieldName = fieldMapping[fieldName] || fieldName;

    // Create payload - try direct field update first
    // If your Sitecore instance stores these in a different structure,
    // you may need to adjust the payload structure
    const payload: Record<string, any> = {
      [sitecoreFieldName]: fieldValue,
    };

    const resp = await axiosClient.patch(
      `https://xmapps-api.sitecorecloud.io/api/v1/pages/${pageId}?${query}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return resp.data;
  } catch (error) {
    console.error("Error updating page field:", error);
    throw error;
  }
};
