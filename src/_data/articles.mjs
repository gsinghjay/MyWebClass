import EleventyFetch from "@11ty/eleventy-fetch";
import { buildQueryUrl } from "./sanity.mjs";

const isDev = process.env.NODE_ENV !== 'production';

export default async function() {
  // GROQ query: fetch published articles with resolved author and relatedStyle references
  // Sorted by publishedAt desc (newest first) per AC4
  const query = `*[_type == "article" && publishedAt != null] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    body,
    author->{
      _id,
      name,
      slug,
      bio,
      image
    },
    relatedStyle->{
      _id,
      title,
      slug
    }
  }`;

  const url = buildQueryUrl(query);

  try {
    const data = await EleventyFetch(url, {
      duration: "1h",
      type: "json"
    });

    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.error("[Sanity] Invalid response structure for articles - expected object");
      return [];
    }

    const result = data.result;
    if (!Array.isArray(result)) {
      console.error("[Sanity] Invalid response for articles - 'result' is not an array");
      return [];
    }

    if (isDev) {
      console.log(`[Sanity] Fetched ${result.length} articles`);
    }

    return result;
  } catch (error) {
    console.error("[Sanity] Failed to fetch articles:", error.message);
    return [];
  }
}
