module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/scripts");

  eleventyConfig.addWatchTarget("src/styles/");
  eleventyConfig.addWatchTarget("src/scripts/");

  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit);
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
