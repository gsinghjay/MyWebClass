module.exports = {
  ci: {
    collect: {
      staticDistDir: './public',
      numberOfRuns: 1,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
