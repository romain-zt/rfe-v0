import type { Block } from 'payload'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { WorksGrid } from './WorksGrid.ts'
import { WorksScroll } from './WorksScroll.ts'
import { FeaturedWork } from './FeaturedWork.ts'
import { TeamShowcase } from './TeamShowcase.ts'
import { PressList } from './PressList.ts'
import { ContactInfo } from './ContactInfo.ts'
import { ContactForm } from './ContactForm.ts'
import { EmbeddedForm } from './EmbeddedForm.ts'
import { LegalSections } from './LegalSections.ts'
import { CallToAction } from './CallToAction.ts'
import { MediaBlock } from './MediaBlock.ts'
import { TwoColumnLayout } from './TwoColumnLayout.ts'

const inlineBlocks: Block[] = [
  WorksGrid,
  WorksScroll,
  FeaturedWork,
  TeamShowcase,
  PressList,
  ContactInfo,
  ContactForm,
  EmbeddedForm,
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
