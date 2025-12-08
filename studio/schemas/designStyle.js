import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'designStyle',
  title: 'Design Style',
  type: 'document',
  fields: [
    // Basic fields (1.2)
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name of the design style (e.g., "Swiss International Style")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      description: 'URL-friendly identifier (auto-generated from title)',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Design style category for filtering',
      options: {
        list: [
          {title: 'Modernism', value: 'modernism'},
          {title: 'Art Movements', value: 'art-movements'},
          {title: 'Postmodern', value: 'postmodern'},
          {title: 'Digital', value: 'digital'},
          {title: 'Retro', value: 'retro'},
          {title: 'Minimalist', value: 'minimalist'},
          {title: 'Expressive', value: 'expressive'}
        ]
      }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief overview of the design style',
      validation: Rule => Rule.max(500)
    }),
    // History with block content (1.3)
    defineField({
      name: 'history',
      title: 'History',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Rich text for origins and background'
    }),
    // Characteristics array (1.4)
    defineField({
      name: 'characteristics',
      title: 'Characteristics',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Key design traits'
    }),
    // Color palette (1.5)
    defineField({
      name: 'colorPalette',
      title: 'Color Palette',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'name', type: 'string', title: 'Color Name'},
          {
            name: 'hex',
            type: 'string',
            title: 'Hex Value',
            description: 'Enter hex color (e.g., #FF5733 or #F53)',
            validation: Rule => Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
              name: 'hex color',
              invert: false
            }).error('Must be a valid hex color (e.g., #FF5733 or #F53)')
          }
        ],
        preview: {
          select: {title: 'name', subtitle: 'hex'}
        }
      }],
      description: 'Representative colors for this style'
    }),
    // Typography object (1.6)
    defineField({
      name: 'typography',
      title: 'Typography',
      type: 'object',
      fields: [
        {name: 'primaryFont', type: 'string', title: 'Primary Font'},
        {name: 'secondaryFont', type: 'string', title: 'Secondary Font'},
        {name: 'notes', type: 'text', title: 'Typography Notes'}
      ],
      description: 'Font recommendations for this style'
    }),
    // Hero image with hotspot and alt text (1.7)
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Main image representing this design style',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Required for accessibility (FR47)',
          validation: Rule => Rule.required()
        }
      ]
    }),
    // Gallery images array (1.8)
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [{
        type: 'image',
        options: {hotspot: true},
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative Text',
            description: 'Required for accessibility (FR47)',
            validation: Rule => Rule.required()
          }
        ]
      }],
      description: 'Additional images showcasing this style'
    }),
    // Template-required fields (1.5 Story)
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex color for this style (e.g., #E53935)',
      validation: Rule => Rule.regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
        name: 'hex color'
      }).error('Must be a valid hex color')
    }),
    defineField({
      name: 'era',
      title: 'Era',
      type: 'string',
      description: 'Historical period (e.g., "1950s-1970s")'
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Emoji',
      type: 'string',
      description: 'Emoji placeholder if no hero image (e.g., "🇨🇭")'
    }),
    defineField({
      name: 'demoUrl',
      title: 'Demo URL',
      type: 'url',
      description: 'Link to interactive demo (optional)'
    }),
    defineField({
      name: 'gridSystem',
      title: 'Grid System',
      type: 'string',
      description: 'Grid layout description (optional)'
    })
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage'
    }
  }
})
