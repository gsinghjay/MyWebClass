/**
 * Migration: Assign categories to all design styles
 * Run with: npx sanity exec migrations/assign-categories.js --with-user-token
 */

import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'gc7vlywa',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2021-10-21',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// Category assignments based on design movement characteristics
const categoryMap = {
  // Modernism - Early 20th century design movements
  'bauhaus': 'modernism',
  'swiss-international-style': 'modernism',
  'swiss-metro': 'modernism',
  'de-stijl': 'modernism',
  'constructivism': 'modernism',
  'futurism': 'modernism',

  // Art Movements - Historical art-based styles
  'art-deco': 'art-movements',
  'art-nouveau': 'art-movements',
  'pop-art': 'art-movements',

  // Postmodern - 1970s-90s rebellion against modernism
  'memphis-design': 'postmodern',
  'new-wave': 'postmodern',
  'deconstructivist-grunge': 'postmodern',
  'grunge': 'postmodern',

  // Digital - UI/UX styles from the digital era
  'flat-design': 'digital',
  'material-design': 'digital',
  'metro-design': 'digital',
  'skeuomorphism': 'digital',
  'corporate-memphis': 'digital',
  'neomorphism': 'digital',
  'glassmorphism': 'digital',
  'isometric': 'digital',

  // Retro - Nostalgic and revival styles
  'retrofuturism': 'retro',
  'vaporwave': 'retro',
  'y2k-aesthetic': 'retro',
  'cyberpunk': 'retro',
  'psychedelic': 'retro',

  // Minimalist - Clean, reductive aesthetics
  'minimalism': 'minimalist',
  'scandinavian': 'minimalist',
  'wabi-sabi': 'minimalist',
  'editorial': 'minimalist',
  'duotone': 'minimalist',

  // Expressive - Bold, experimental styles
  'brutalist': 'expressive',
  'gothic-dark': 'expressive',
  'risograph': 'expressive'
}

async function assignCategories() {
  console.log('Fetching all design styles...')

  const styles = await client.fetch('*[_type == "designStyle"]{_id, title, "slug": slug.current, category}')

  console.log(`Found ${styles.length} design styles`)

  const updates = []

  for (const style of styles) {
    const slug = style.slug
    const newCategory = categoryMap[slug]

    if (newCategory && style.category !== newCategory) {
      console.log(`  ${style.title} (${slug}): ${style.category || 'none'} → ${newCategory}`)
      updates.push({
        _id: style._id,
        title: style.title,
        newCategory
      })
    } else if (!newCategory) {
      console.log(`  ⚠️ ${style.title} (${slug}): No category mapping found`)
    } else {
      console.log(`  ✓ ${style.title}: Already set to ${style.category}`)
    }
  }

  if (updates.length === 0) {
    console.log('\nNo updates needed!')
    return
  }

  console.log(`\nApplying ${updates.length} updates...`)

  // Use transactions for batch updates
  const transaction = client.transaction()

  for (const update of updates) {
    transaction.patch(update._id, {
      set: { category: update.newCategory }
    })
  }

  const result = await transaction.commit()

  console.log(`\n✅ Successfully updated ${updates.length} design styles!`)
  console.log(`Transaction ID: ${result.transactionId}`)
}

assignCategories().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
