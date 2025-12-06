export default {
  name: "MyWebClass.org",
  description: "A digital museum of design styles",
  url: process.env.SITE_URL || "https://mywebclass.org",
  language: "en",
  author: {
    name: "MyWebClass Team",
    email: "hello@mywebclass.org"
  },
  sanityProjectId: process.env.SANITY_PROJECT_ID || 'your_sanity_project_id',
  sanityDataset: process.env.SANITY_DATASET || 'production'
};
