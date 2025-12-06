export default {
  pagination: {
    data: 'designStyles',
    size: 1,
    alias: 'style',
    addAllPagesToCollections: true
  },
  permalink: function(data) {
    if (data.style && data.style.slug) {
      return `/gallery/${data.style.slug.current}/`;
    }
    return false;
  },
  eleventyComputed: {
    title: function(data) {
      return data.style ? data.style.title : 'Design Style';
    },
    description: function(data) {
      return data.style ? data.style.description : '';
    }
  }
};
