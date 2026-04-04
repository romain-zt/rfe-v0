import type { Block } from 'payload'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { WorksGrid } from './WorksGrid'
import { WorksScroll } from './WorksScroll'
import { FeaturedWork } from './FeaturedWork'
import { TeamShowcase } from './TeamShowcase'
import { PressList } from './PressList'
import { ContactInfo } from './ContactInfo'
import { ContactForm } from './ContactForm'
import { LegalSections } from './LegalSections'
import { CallToAction } from './CallToAction'
import { MediaBlock } from './MediaBlock'
import { TwoColumnLayout } from './TwoColumnLayout'

const inlineBlocks: Block[] = [
  WorksGrid,
  WorksScroll,
  FeaturedWork,
  TeamShowcase,
  PressList,
  ContactInfo,
  ContactForm,
  LegalSections,
  CallToAction,
  MediaBlock,
  TwoColumnLayout,
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'full',
          options: [
            { label: 'Full Width', value: 'full' },
            { label: 'Half', value: 'half' },
            { label: 'One Third', value: 'oneThird' },
            { label: 'Two Thirds', value: 'twoThirds' },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              BlocksFeature({ blocks: inlineBlocks }),
            ],
          }),
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'sectionTone',
      type: 'select',
      admin: { description: 'Background tone for this section' },
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Deep', value: 'deep' },
        { label: 'Charcoal', value: 'charcoal' },
        { label: 'Slate', value: 'slate' },
        { label: 'Warm', value: 'warm' },
        { label: 'Cool', value: 'cool' },
        { label: 'Ember', value: 'ember' },
        { label: 'Dusk', value: 'dusk' },
      ],
    },
  ],
}
