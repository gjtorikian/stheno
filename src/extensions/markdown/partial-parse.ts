import { type Parser, Tree } from '@lezer/common'
import { type BlockContext, type InlineContext, type Element } from '@lezer/markdown'

export function partialParse(ctx: BlockContext | InlineContext, parser: Parser, text: string, offset: number): Element {
    const innerTree = parser.parse(text)
    // Here we detach the syntax tree from the containing `Document` node, since
    // a parser expects that it needs to parse a full document. However, a child
    // `Document` element may or may not cause problems so we take it off its
    // root here.
    let treeElem = ctx.elt(innerTree, offset)
    const firstChild = innerTree.children[0]
    if (firstChild instanceof Tree) {
        treeElem = ctx.elt(firstChild, offset)
    }

    return treeElem
}
