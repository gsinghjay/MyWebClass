import 'dotenv/config';
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.SANITY_PROJECT_ID || null;
const isConfigured = projectId && projectId !== 'your_sanity_project_id' && /^[a-z0-9-]+$/.test(projectId);

let client = null;
let builder = null;

if (isConfigured) {
  client = createClient({
    projectId,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
    useCdn: true,
    token: process.env.SANITY_TOKEN
  });
  builder = imageUrlBuilder(client);
}

export function urlFor(source) {
  if (!builder) return { url: () => '' };
  return builder.image(source);
}

export { client, isConfigured };
export default client;
