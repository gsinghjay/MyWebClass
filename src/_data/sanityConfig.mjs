// Expose Sanity configuration to templates for CDN image URL building
import { projectId, dataset } from './sanity.mjs';

export default function() {
  return {
    projectId,
    dataset
  };
}
