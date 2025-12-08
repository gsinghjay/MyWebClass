import { describe, it } from 'node:test';
import assert from 'node:assert';
import { buildQueryUrl, projectId, dataset, apiVersion, getSanityImageUrl } from '../src/_data/sanity.mjs';

describe('sanity.mjs', () => {
  describe('configuration exports', () => {
    it('should export projectId with default value', () => {
      assert.ok(projectId, 'projectId should be defined');
      assert.strictEqual(typeof projectId, 'string');
    });

    it('should export dataset with default value', () => {
      assert.ok(dataset, 'dataset should be defined');
      assert.strictEqual(typeof dataset, 'string');
    });

    it('should export apiVersion as 2021-10-21', () => {
      assert.strictEqual(apiVersion, '2021-10-21');
    });
  });

  describe('buildQueryUrl', () => {
    it('should build a valid Sanity API URL', () => {
      const query = '*[_type == "designStyle"]';
      const url = buildQueryUrl(query);

      assert.ok(url.startsWith('https://'), 'URL should start with https://');
      assert.ok(url.includes('.api.sanity.io'), 'URL should include Sanity API domain');
      assert.ok(url.includes('/data/query/'), 'URL should include query endpoint');
    });

    it('should URL-encode the query parameter', () => {
      const query = '*[_type == "test" && status == "approved"]';
      const url = buildQueryUrl(query);

      // The query should be URL-encoded (spaces become %20, == becomes %3D%3D, etc.)
      assert.ok(!url.includes(' '), 'URL should not contain unencoded spaces');
      assert.ok(url.includes(encodeURIComponent(query)), 'URL should contain encoded query');
    });

    it('should include projectId in the URL', () => {
      const url = buildQueryUrl('*');
      assert.ok(url.includes(projectId), 'URL should include projectId');
    });

    it('should include dataset in the URL', () => {
      const url = buildQueryUrl('*');
      assert.ok(url.includes(dataset), 'URL should include dataset');
    });

    it('should include apiVersion in the URL path', () => {
      const url = buildQueryUrl('*');
      assert.ok(url.includes(`/v${apiVersion}/`), 'URL should include API version');
    });

    it('should handle special characters in queries', () => {
      const query = '*[_type == "gallerySubmission" && status == "approved"]{..., styleRef->}';
      const url = buildQueryUrl(query);

      // Should not throw and should produce valid URL
      assert.ok(url.length > 0, 'URL should be generated');
      new URL(url); // This will throw if URL is invalid
    });
  });

  describe('getSanityImageUrl', () => {
    it('should return null when imageRef is null', () => {
      const result = getSanityImageUrl(null);
      assert.strictEqual(result, null);
    });

    it('should return null when imageRef is undefined', () => {
      const result = getSanityImageUrl(undefined);
      assert.strictEqual(result, null);
    });

    it('should return null when imageRef has no asset', () => {
      const result = getSanityImageUrl({});
      assert.strictEqual(result, null);
    });

    it('should return null when imageRef.asset has no _ref', () => {
      const result = getSanityImageUrl({ asset: {} });
      assert.strictEqual(result, null);
    });

    it('should build correct CDN URL for valid image reference', () => {
      const imageRef = {
        asset: {
          _ref: 'image-abc123-800x600-jpg'
        }
      };
      const url = getSanityImageUrl(imageRef);

      assert.ok(url, 'URL should be generated');
      assert.ok(url.startsWith('https://cdn.sanity.io/images/'), 'URL should use Sanity CDN');
      assert.ok(url.includes(projectId), 'URL should include projectId');
      assert.ok(url.includes(dataset), 'URL should include dataset');
      assert.ok(url.includes('abc123-800x600.jpg'), 'URL should include parsed image id and format');
    });

    it('should apply default width parameter of 400', () => {
      const imageRef = {
        asset: {
          _ref: 'image-abc123-800x600-jpg'
        }
      };
      const url = getSanityImageUrl(imageRef);

      assert.ok(url.includes('w=400'), 'URL should have default width of 400');
    });

    it('should accept custom width parameter', () => {
      const imageRef = {
        asset: {
          _ref: 'image-abc123-800x600-jpg'
        }
      };
      const url = getSanityImageUrl(imageRef, 800);

      assert.ok(url.includes('w=800'), 'URL should use custom width');
    });

    it('should include auto=format for WebP delivery', () => {
      const imageRef = {
        asset: {
          _ref: 'image-abc123-800x600-jpg'
        }
      };
      const url = getSanityImageUrl(imageRef);

      assert.ok(url.includes('auto=format'), 'URL should include auto=format for WebP delivery');
    });

    it('should include fit=crop parameter', () => {
      const imageRef = {
        asset: {
          _ref: 'image-abc123-800x600-jpg'
        }
      };
      const url = getSanityImageUrl(imageRef);

      assert.ok(url.includes('fit=crop'), 'URL should include fit=crop parameter');
    });

    it('should handle png format correctly', () => {
      const imageRef = {
        asset: {
          _ref: 'image-xyz789-1200x800-png'
        }
      };
      const url = getSanityImageUrl(imageRef);

      assert.ok(url.includes('xyz789-1200x800.png'), 'URL should handle PNG format');
    });

    it('should handle webp format correctly', () => {
      const imageRef = {
        asset: {
          _ref: 'image-webp123-400x300-webp'
        }
      };
      const url = getSanityImageUrl(imageRef);

      assert.ok(url.includes('webp123-400x300.webp'), 'URL should handle WebP format');
    });
  });
});
