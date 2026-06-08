import type { Block } from 'payload'
import { Content } from './Content.ts'
import { MediaBlock } from './MediaBlock.ts'
import { CallToAction } from './CallToAction.ts'
import { TwoColumnLayout } from './TwoColumnLayout.ts'
import { WorksGrid } from './WorksGrid.ts'
import { WorksScroll } from './WorksScroll.ts'
import { FeaturedWork } from './FeaturedWork.ts'
import { TeamShowcase } from './TeamShowcase.ts'
import { PressList } from './PressList.ts'
import { ContactInfo } from './ContactInfo.ts'
import { ContactForm } from './ContactForm.ts'
import { EmbeddedForm } from './EmbeddedForm.ts'
import { LegalSections } from './LegalSections.ts'

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
  EmbeddedForm,
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
  EmbeddedForm,
  LegalSections,
]
