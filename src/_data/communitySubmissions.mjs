import EleventyFetch from "@11ty/eleventy-fetch";
import { buildQueryUrl } from "./sanity.mjs";

const isDev = process.env.NODE_ENV !== 'production';

export default async function() {
  // Fetch approved submissions that are NOT featured (to avoid duplication with Featured Themes)
  // Order by _createdAt desc (newest first) - using _createdAt as Sanity built-in field
  // Limit to 12 items for performance (pagination can be added later if needed)
  const query = '*[_type == "gallerySubmission" && status == "approved" && isFeatured != true]{..., styleRef->} | order(_createdAt desc)[0...12]';
  const url = buildQueryUrl(query);

  try {
    const data = await EleventyFetch(url, {
      duration: "1h",
      type: "json"
    });

    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error("[Sanity] Invalid response structure for community submissions");
      return [];
    }

    const result = data.result;
    if (!Array.isArray(result)) {
      console.error("[Sanity] Invalid response - 'result' is not an array");
      return [];
    }

    if (isDev) {
      console.log(`[Sanity] Fetched ${result.length} community submissions`);
    }
    return result;
  } catch (error) {
    console.error("[Sanity] Failed to fetch community submissions:", error.message);
    return [];
  }
}
