// Sanity API configuration for Eleventy data fetching
const projectId = process.env.SANITY_PROJECT_ID || 'gc7vlywa';
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = '2021-10-21';

/**
 * Build a Sanity API query URL
 * @param {string} query - GROQ query string
 * @returns {string} - Full API URL
 */
export function buildQueryUrl(query) {
  const encodedQuery = encodeURIComponent(query);
  return `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodedQuery}`;
}

/**
 * Build optimized Sanity CDN image URL
 * @param {Object} imageRef - Sanity image reference object
 * @param {number} width - Target width in pixels (default 400)
 * @returns {string|null} - CDN URL or null if no image
 */
export function getSanityImageUrl(imageRef, width = 400) {
  if (!imageRef?.asset?._ref) return null;

  // Parse: image-{id}-{width}x{height}-{format}
  const parts = imageRef.asset._ref.split('-');
  const id = parts[1];
  const dimensions = parts[2];
  const format = parts[3];

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=${width}&fit=crop&auto=format`;
}

export { projectId, dataset, apiVersion };
