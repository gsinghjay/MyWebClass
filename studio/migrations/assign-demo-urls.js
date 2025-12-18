/**
 * Migration: Assign demo URLs to design styles
 * Run with: node migrations/assign-demo-urls.js
 */

const {createClient} = require('@sanity/client')

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'gc7vlywa',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2021-10-21',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// Demo URL assignments by style title (case-insensitive match)
const demoUrlMap = {
  'skeuomorphism': 'https://claude.ai/public/artifacts/f3314386-7fd5-4b13-b8c0-b8601631a183',
  'futurism': 'https://claude.ai/public/artifacts/cc6d3be1-ca05-48b5-a694-b739961a6daf',
  'glassmorphism': 'https://claude.ai/public/artifacts/fc2195b8-255a-477f-ab8c-028c2143d7da',
  'retrofuturism': 'https://claude.ai/public/artifacts/02354c9e-850b-4224-b687-26cb526eb7ff',
  'cyberpunk': 'https://claude.ai/public/artifacts/1d7e54f4-57ad-4d24-afb4-dfacee5144c6',
  'isometric': 'https://claude.ai/public/artifacts/8e95acc4-53fa-4d91-8471-662fc5723811'
}

async function assignDemoUrls() {
  console.log('Fetching all design styles...')

  const styles = await client.fetch('*[_type == "designStyle"]{_id, title, "slug": slug.current, demoUrl}')

  console.log(`Found ${styles.length} design styles`)

  const updates = []

  for (const style of styles) {
    const titleKey = style.title.toLowerCase()
    const newDemoUrl = demoUrlMap[titleKey]

    if (newDemoUrl && style.demoUrl !== newDemoUrl) {
      console.log(`  ${style.title}: ${style.demoUrl || 'none'} → ${newDemoUrl}`)
      updates.push({
        _id: style._id,
        title: style.title,
        newDemoUrl
      })
    } else if (newDemoUrl && style.demoUrl === newDemoUrl) {
      console.log(`  ✓ ${style.title}: Already set`)
    }
  }

  if (updates.length === 0) {
    console.log('\nNo updates needed!')
    return
  }

  console.log(`\nApplying ${updates.length} updates...`)

  const transaction = client.transaction()

  for (const update of updates) {
    transaction.patch(update._id, {
      set: { demoUrl: update.newDemoUrl }
    })
  }

  const result = await transaction.commit()

  console.log(`\n✅ Successfully updated ${updates.length} design styles with demo URLs!`)
  console.log(`Transaction ID: ${result.transactionId}`)
}

assignDemoUrls().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
