import EleventyFetch from "@11ty/eleventy-fetch";
import { buildQueryUrl } from "./sanity.mjs";

const isDev = process.env.NODE_ENV !== 'production';

export default async function() {
  // Fetch approved + featured submissions, ordered by featuredOrder, limited to 6
  const query = '*[_type == "gallerySubmission" && status == "approved" && isFeatured == true]{..., styleRef->} | order(featuredOrder asc)[0...6]';
  const url = buildQueryUrl(query);

  try {
    const data = await EleventyFetch(url, {
      duration: "1h",
      type: "json"
    });

    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error("[Sanity] Invalid response structure for featured submissions");
      return [];
    }

    const result = data.result;
    if (!Array.isArray(result)) {
      console.error("[Sanity] Invalid response - 'result' is not an array");
      return [];
    }

    if (isDev) {
      console.log(`[Sanity] Fetched ${result.length} featured submissions`);
    }
    return result;
  } catch (error) {
    console.error("[Sanity] Failed to fetch featured submissions:", error.message);
    return [];
  }
}
