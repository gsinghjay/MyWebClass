/**
 * Create gallery submissions from local screenshots
 * Place screenshots in migrations/screenshots/ folder with names:
 *   skeuomorphism.jpg, futurism.jpg, glassmorphism.jpg,
 *   retrofuturism.jpg, cyberpunk.jpg, isometric-design.jpg
 * Run with: node migrations/create-demo-submissions.js
 */

const {createClient} = require('@sanity/client')
const fs = require('fs')
const path = require('path')

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'gc7vlywa',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2021-10-21',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

const demos = [
  {
    styleName: 'Skeuomorphism',
    url: 'https://claude.ai/public/artifacts/f3314386-7fd5-4b13-b8c0-b8601631a183'
  },
  {
    styleName: 'Futurism',
    url: 'https://claude.ai/public/artifacts/cc6d3be1-ca05-48b5-a694-b739961a6daf'
  },
  {
    styleName: 'Glassmorphism',
    url: 'https://claude.ai/public/artifacts/fc2195b8-255a-477f-ab8c-028c2143d7da'
  },
  {
    styleName: 'Retrofuturism',
    url: 'https://claude.ai/public/artifacts/02354c9e-850b-4224-b687-26cb526eb7ff'
  },
  {
    styleName: 'Cyberpunk',
    url: 'https://claude.ai/public/artifacts/1d7e54f4-57ad-4d24-afb4-dfacee5144c6'
  },
  {
    styleName: 'Isometric Design',
    url: 'https://claude.ai/public/artifacts/8e95acc4-53fa-4d91-8471-662fc5723811'
  }
]

async function run() {
  const screenshotDir = path.join(__dirname, 'screenshots')
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir)
  }

  // Get all design styles for reference lookup
  const styles = await client.fetch('*[_type == "designStyle"]{_id, title}')
  const styleMap = {}
  styles.forEach(s => {
    styleMap[s.title.toLowerCase()] = s._id
  })

  // Check existing submissions to skip duplicates
  const existingSubmissions = await client.fetch(
    '*[_type == "gallerySubmission" && submitterEmail == "demo@mywebclass.org"]{demoUrl}'
  )
  const existingUrls = new Set(existingSubmissions.map(s => s.demoUrl))

  for (const demo of demos) {
    const slug = demo.styleName.toLowerCase().replace(/\s+/g, '-')
    // Check for jpg or png
    let screenshotPath = path.join(screenshotDir, `${slug}.jpg`)
    if (!fs.existsSync(screenshotPath)) {
      screenshotPath = path.join(screenshotDir, `${slug}.jpeg`)
    }
    if (!fs.existsSync(screenshotPath)) {
      screenshotPath = path.join(screenshotDir, `${slug}.png`)
    }

    console.log(`\nProcessing ${demo.styleName}...`)

    if (existingUrls.has(demo.url)) {
      console.log(`  ✓ Already exists, skipping`)
      continue
    }

    // Check screenshot exists
    if (!fs.existsSync(screenshotPath)) {
      console.log(`  ⚠️ Screenshot not found: ${screenshotPath}`)
      continue
    }
    console.log(`  Found: ${path.basename(screenshotPath)}`)

    // Upload to Sanity with retry
    console.log(`  Uploading to Sanity...`)
    let imageAsset
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const ext = path.extname(screenshotPath)
        imageAsset = await client.assets.upload('image', fs.createReadStream(screenshotPath), {
          filename: `${slug}-demo${ext}`
        })
        console.log(`  ✓ Uploaded: ${imageAsset._id}`)
        break
      } catch (uploadErr) {
        console.log(`  ⚠️ Upload attempt ${attempt} failed: ${uploadErr.message}`)
        if (attempt === 3) throw uploadErr
        await new Promise(r => setTimeout(r, 2000 * attempt))
      }
    }

    // Find style reference
    const styleId = styleMap[demo.styleName.toLowerCase()]
    if (!styleId) {
      console.log(`  ⚠️ Style not found: ${demo.styleName}`)
      continue
    }

    // Create submission
    try {
      console.log(`  Creating submission...`)
      const submission = await client.create({
        _type: 'gallerySubmission',
        submitterName: 'Claude AI',
        submitterEmail: 'demo@mywebclass.org',
        styleRef: {_type: 'reference', _ref: styleId},
        demoUrl: demo.url,
        screenshot: {
          _type: 'image',
          asset: {_type: 'reference', _ref: imageAsset._id},
          alt: `${demo.styleName} design style demo screenshot`
        },
        authenticityExplanation: `AI-generated demonstration of the ${demo.styleName} design style, created to showcase key visual characteristics and principles.`,
        hasPublicDisplayConsent: true,
        hasMarketingConsent: true,
        status: 'approved',
        submittedAt: new Date().toISOString(),
        reviewedAt: new Date().toISOString()
      })
      console.log(`  ✓ Submission created: ${submission._id}`)
    } catch (createErr) {
      console.log(`  ⚠️ Failed to create submission: ${createErr.message}`)
    }
  }

  console.log('\n✅ Done!')
}

run().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})
