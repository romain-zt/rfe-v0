import type { Block } from 'payload'
import { Content } from './Content'
import { MediaBlock } from './MediaBlock'
import { CallToAction } from './CallToAction'
import { TwoColumnLayout } from './TwoColumnLayout'
import { WorksGrid } from './WorksGrid'
import { WorksScroll } from './WorksScroll'
import { FeaturedWork } from './FeaturedWork'
import { TeamShowcase } from './TeamShowcase'
import { PressList } from './PressList'
import { ContactInfo } from './ContactInfo'
import { ContactForm } from './ContactForm'
import { LegalSections } from './LegalSections'

export {
  Content,
  MediaBlock,
  CallToAction,
  TwoColumnLayout,
  WorksGrid,
  WorksScroll,
  FeaturedWork,
  TeamShowcase,
  PressList,
  ContactInfo,
  ContactForm,
  LegalSections,
}

export const blocks: Block[] = [
  Content,
  MediaBlock,
  CallToAction,
  TwoColumnLayout,
  WorksGrid,
  WorksScroll,
  FeaturedWork,
  TeamShowcase,
  PressList,
  ContactInfo,
  ContactForm,
  LegalSections,
]
