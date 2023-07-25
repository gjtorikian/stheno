import { type InlineParser, type DelimiterType, type InlineContext } from '@lezer/markdown'
import { parser as liquidParser } from "@yettoapp/lezer-liquid"

import { partialParse } from './partial-parse'

const AsciiCurlyOpen = 123
const AsciiPercent = 37
const AsciiLiquidOpeners = new Set([AsciiCurlyOpen, AsciiPercent])
const LiquidWrappers = /(?<opening>\{\{|\%)(?<code>.*)(?<closing>\%|\}\})/

// https://github.com/lezer-parser/markdown#user-content-inlineparser
export const liquidInlineParser: InlineParser = {
    name: 'inlineLiquid',
    parse: (ctx, next, pos) => {
        if (AsciiLiquidOpeners.has(next) && !AsciiLiquidOpeners.has(ctx.char(pos + 1))) return -1

        const match = LiquidWrappers.exec(ctx.text)

        // Exit if no match
        if (!match) return -1
        // Exit if there's no closing tag
        if (!match.groups?.closing) return -1
        // Exit if the match is full of empty space (e.g {{}} or {%     %}
        if (!match.groups?.code?.trim()) return -1

        let curPos = pos
        const lengths = {
            opening: match.groups.opening.length,
            code: match.groups.code.length,
            closing: match.groups.code.length
        }

        const childNodes = [ctx.elt('LiquidOutputStart', pos, lengths.opening)]
        curPos += lengths.opening

        const treeElem = partialParse(ctx, liquidParser, match.groups.code.trim(), lengths.opening)
        childNodes.push(treeElem)
        curPos += lengths.code

        childNodes.push(ctx.elt('LiquidOutputEnd', curPos, curPos + lengths.closing))
        curPos += lengths.closing

        const wrapperElem = ctx.elt('InlineCode', pos, curPos, childNodes)
        return ctx.addElement(wrapperElem)
    },
}
