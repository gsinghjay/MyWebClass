module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/scripts");

  eleventyConfig.addWatchTarget("src/styles/");
  eleventyConfig.addWatchTarget("src/scripts/");

  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
  });

  // Date formatting filter for articles
  eleventyConfig.addFilter("date", function(dateString, format) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
    // Support "MMMM d, yyyy" format
    if (format === "MMMM d, yyyy") {
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    // Default ISO format
    return date.toISOString().split('T')[0];
  });

  // Extract plain text from first block for excerpt
  eleventyConfig.addFilter("extractExcerpt", function(body, maxLength = 150) {
    if (!body || !Array.isArray(body)) return "";
    for (const block of body) {
      if (block._type === 'block' && block.children) {
        const text = block.children.map(span => span.text || '').join('');
        if (text) {
          return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        }
      }
    }
    return "";
  });

  eleventyConfig.addFilter("filterByStatus", function(array, status) {
    return array.filter(item => item.status === status);
  });

  eleventyConfig.addCollection("designStyles", function(collectionApi) {
    return collectionApi.getAll().filter(item => item.data.designStyle);
  });

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data"
    },
    pathPrefix: process.env.GITHUB_ACTIONS ? "/MyWebClass/" : "/",
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
