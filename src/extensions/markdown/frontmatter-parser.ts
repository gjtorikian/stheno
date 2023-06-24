import { type BlockParser } from '@lezer/markdown'
import { parser as jsoncParser } from "@yettoapp/lezer-jsonc"
import { partialParse } from './partial-parse'

const FRONTMATTER_START = '--{'
const FRONTMATTER_END = new RegExp(`^}--$`)

// Docs for this: https://github.com/lezer-parser/markdown#user-content-blockparser
export const frontmatterParser: BlockParser = {
    // We need to give the parser a name
    name: 'Frontmatter',
    before: 'HorizontalRule',
    parse: (ctx, line) => {
        // This parser is inspired by the BlockParsers defined in
        // @lezer/markdown/src/markdown.ts
        if (line.text !== FRONTMATTER_START || ctx.lineStart !== 0) {
            return false
        }

        // We have possible JSONC frontmatter. Now we need to look for the end of
        // the frontmatter.
        // Meanwhile, we'll be collecting all lines encountered so that we can parse
        // them into a JSONC AST.
        const jsoncLines: string[] = []

        // We also need the position at which the (actual) frontmatter starts
        const from = 4
        while (ctx.nextLine() && !FRONTMATTER_END.test(line.text)) {
            jsoncLines.push(line.text)
        }

        if (!FRONTMATTER_END.test(line.text)) {
            // The parser has collected the full rest of the document. This means
            // the frontmatter never stopped. In order to maintain readability, we
            // simply abort parsing.
            return false
        }

        if (jsoncLines.length === 0) {
            return false // Frontmatter must have content
        }

        // A final check: A frontmatter is NOT a valid document if there is
        // whitespace at the top (i.e. no blank lines between the delimiters and the
        // frontmatter content). NOTE: Whitespace AFTER the frontmatter content is
        // allowed!
        if (jsoncLines[0].trim() === '') {
            return false
        }

        // At this point we have a full JSONC frontmatter; we know where
        // it starts and we know where it ends. In order to simplify creating the
        // required AST, we defer to letting the JSONC parser parse this thing into
        // a tree that we can then simply convert into the format consumed by
        // Codemirror. Keep in mind that we need to add the `{ }` back in, since
        // we've slurped them up as part of the frontmatter delimiters.
        const treeElem = partialParse(ctx, jsoncParser, `{${jsoncLines.join('\n')}`, from)

        const wrapperNode = ctx.elt('FencedCode', 0, ctx.lineStart + 3, [
            ctx.elt('JSONCFrontmatterStart', 0, 3),
            ctx.elt('JSONCFrontmatterMap', 4, ctx.lineStart - 1, [treeElem]),
            ctx.elt('JSONCFrontmatterEnd', ctx.lineStart, ctx.lineStart + 3)
        ])

        ctx.addElement(wrapperNode)

        return true
    }
}
