export type LexicalTextNode = {
  type: 'text'
  text: string
  format?: number
  style?: string
}

export type LexicalFieldValues = {
  url?: string
  newTab?: boolean
  linkType?: string
  blockType?: string
  id?: string
}

export type LexicalElementNode = {
  type: string
  tag?: string
  listType?: string
  url?: string
  fields?: LexicalFieldValues & Record<string, unknown>
  children?: LexicalNode[]
  direction?: string
  indent?: number
  format?: string | number
  version?: number
}

export type LexicalNode = LexicalTextNode | LexicalElementNode

export type LexicalRichText = {
  root: LexicalElementNode
}

export type BlockComponentProps = Record<string, unknown>

export function isLexicalTextNode(node: LexicalNode): node is LexicalTextNode {
  return node.type === 'text'
}

export function isLexicalElementNode(node: LexicalNode): node is LexicalElementNode {
  return node.type !== 'text'
}
