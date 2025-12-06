import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'gc7vlywa',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN // Needs write token
});

async function updateSwissMetro() {
  // First, find the Swiss Metro document
  const query = `*[_type == "designStyle" && slug.current == "swiss-metro"][0]`;
  const doc = await client.fetch(query);

  if (!doc) {
    console.error('Swiss Metro document not found');
    process.exit(1);
  }

  console.log('Found document:', doc._id);

  // Update with full content
  const result = await client
    .patch(doc._id)
    .set({
      historicalBackground: [
        {
          _type: 'block',
          _key: 'hist1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'hist1span',
              text: 'Swiss Design emerged in the 1950s from the Zurich and Basel schools of design. Pioneers like Josef Müller-Brockmann, Armin Hofmann, and Max Bill established principles that prioritized objective, universal communication, systematic grid-based layouts, asymmetric compositions, photography over illustration, and sans-serif typography (especially Helvetica).'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'hist2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'hist2span',
              text: 'These principles revolutionized corporate identity, wayfinding systems, and information design worldwide. The New York City subway system, Swiss Federal Railways, and countless corporate identities bear the influence of Swiss Design.'
            }
          ]
        }
      ],
      keyCharacteristics: [
        {
          _type: 'block',
          _key: 'char1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'char1span',
              text: 'This demonstration showcases the Swiss International Typographic Style applied to modern transit system design. Swiss Design, originating in Switzerland in the 1950s, emphasizes cleanliness, readability, and objectivity.'
            }
          ]
        }
      ],
      principles: [
        'Grid-Based Layout: Mathematical precision in element placement',
        'Sans-Serif Typography: Clean, readable typefaces (Helvetica-inspired)',
        'Minimal Color Palette: Strategic use of color for wayfinding and hierarchy',
        'Negative Space: Generous whitespace for visual breathing room',
        'Functional Design: Every element serves a purpose'
      ],
      colorPalette: [
        { _key: 'color1', name: 'Black', hex: '#000000' },
        { _key: 'color2', name: 'White', hex: '#FFFFFF' },
        { _key: 'color3', name: 'Swiss Red', hex: '#FF0000' }
      ],
      typographyGuidance: [
        {
          _type: 'block',
          _key: 'typo1',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'typo1span',
              text: 'Swiss Design favors clean, geometric sans-serif typefaces. Helvetica is the quintessential Swiss typeface, designed in 1957 by Max Miedinger. Modern alternatives like Inter, Univers, or system sans-serif fonts work well for digital applications.'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'typo2',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'typo2span',
              text: 'Typography should establish clear hierarchy through size, weight, and spacing—not decorative effects. Use bold weights sparingly for emphasis. Maintain generous line-height (1.4-1.6) for body text and tight leading for headlines.'
            }
          ]
        },
        {
          _type: 'block',
          _key: 'typo3',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'typo3span',
              text: 'Key principles: Left-aligned or justified text, avoid centered text for body copy, use a modular scale for font sizes, and maintain consistent spacing throughout. The grid system should guide all typographic decisions.'
            }
          ]
        }
      ],
      technologies: ['HTML5', 'CSS3', 'CSS Grid', 'Responsive Design', 'GitHub Pages'],
      demoUrl: 'https://gsinghjay.github.io/swiss_metro/',
      githubRepo: 'https://github.com/gsinghjay/swiss_metro',
      featured: true
    })
    .commit();

  console.log('✅ Updated Swiss Metro:', result._id);
}

updateSwissMetro().catch(console.error);
