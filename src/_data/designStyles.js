import { client, isConfigured } from './sanity.js';

export default async function() {
  if (!isConfigured || !client) {
    console.log('[11ty] Sanity not configured - returning empty design styles array');
    return [];
  }

  try {
    const query = `*[_type == "designStyle"] | order(publishedAt desc) {
      _id, title, slug, description, historicalBackground,
      keyCharacteristics, colorPalette, typographyGuidance,
      principles, sampleImages, demoUrl, githubRepo,
      technologies, featured, publishedAt
    }`;
    const styles = await client.fetch(query);
    console.log(`[11ty] Fetched ${styles.length} design styles from Sanity`);
    return styles;
  } catch (error) {
    console.error('[11ty] Error fetching design styles:', error.message);
    return [];
  }
}
