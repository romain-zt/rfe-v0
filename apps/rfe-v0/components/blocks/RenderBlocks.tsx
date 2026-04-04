import React, { Fragment } from 'react'
import { ContentBlockComponent } from './ContentBlock'
import { MediaBlockComponent } from './MediaBlockComponent'
import { CTABlockComponent } from './CTABlock'
import { TwoColumnLayoutComponent } from './TwoColumnLayoutBlock'
import { WorksGridComponent } from './WorksGridBlock'
import { WorksScrollComponent } from './WorksScrollBlock'
import { FeaturedWorkComponent } from './FeaturedWorkBlock'
import { TeamShowcaseComponent } from './TeamShowcaseBlock'
import { PressListComponent } from './PressListBlock'
import { ContactInfoComponent } from './ContactInfoBlock'
import { ContactFormComponent } from './ContactFormBlock'
import { LegalSectionsComponent } from './LegalSectionsBlock'

const blockComponents: Record<string, React.ComponentType<any>> = {
  content: ContentBlockComponent,
  mediaBlock: MediaBlockComponent,
  cta: CTABlockComponent,
  twoColumnLayout: TwoColumnLayoutComponent,
  worksGrid: WorksGridComponent,
  worksScroll: WorksScrollComponent,
  featuredWork: FeaturedWorkComponent,
  teamShowcase: TeamShowcaseComponent,
  pressList: PressListComponent,
  contactInfo: ContactInfoComponent,
  contactForm: ContactFormComponent,
  legalSections: LegalSectionsComponent,
}

type Block = {
  blockType: string
  [key: string]: unknown
}

export function RenderBlocks({ blocks }: { blocks: Block[] }) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null
  }

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block
        const Block = blockComponents[blockType]

        if (!Block) return null

        return (
          <div key={index}>
            <Block {...block} />
          </div>
        )
      })}
    </Fragment>
  )
}
