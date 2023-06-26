import { type InlineParser, type DelimiterType, type InlineContext } from '@lezer/markdown'
import { parser as liquidParser } from "@yettoapp/lezer-liquid"

import { partialParse } from './partial-parse'

const AsciiCurlyOpen = 123
const CurlyOutputClose = new RegExp(`}}[^}]?`)

// https://github.com/lezer-parser/markdown#user-content-inlineparser
export const liquidInlineParser: InlineParser = {
    name: 'inlineLiquid',
    parse: (ctx, next, pos) => {
        if (next != AsciiCurlyOpen || ctx.char(pos + 1) != AsciiCurlyOpen || ctx.char(pos + 2) == AsciiCurlyOpen) return -1

        const afterOpen = ctx.slice(pos + 2, ctx.end)
        if (!CurlyOutputClose.test(afterOpen)) {
            return -1
        }
        const closingIndex = afterOpen.indexOf("}}")
        const innerLiquid = afterOpen.slice(0, closingIndex)

        // could happen if the text is {{}}
        if (/^\s*$/.test(innerLiquid)) {
            return -1
        }

        let curPos = pos
        const childNodes = [ctx.elt('LiquidOutputStart', curPos, curPos + 2)]

        curPos += 2
        const treeElem = partialParse(ctx, liquidParser, innerLiquid, curPos)
        childNodes.push(treeElem)

        curPos += innerLiquid.length
        childNodes.push(ctx.elt('LiquidOutputEnd', curPos, curPos + 2))

        curPos += 2
        const wrapperElem = ctx.elt('InlineCode', pos, curPos, childNodes)
        return ctx.addElement(wrapperElem)
    },
}
