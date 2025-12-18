import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'gc7vlywa',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production'
  },
  deployment: {
    appId: 'dq34aj4pa1xo8gxupe17z46n',
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
