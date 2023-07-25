import { LanguageSupport } from "@codemirror/language"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { json } from "@codemirror/lang-json"
import { Compartment } from "@codemirror/state"
import { Tag, tags } from '@lezer/highlight'

import { frontmatterParser } from './extensions/markdown/frontmatter-parser'
import { liquidInlineParser } from './extensions/markdown/liquid-parser'

const customTags = {
  JSONCFrontmatterStart: Tag.define(tags.contentSeparator),
  JSONCFrontmatterEnd: Tag.define(tags.contentSeparator),
  JSONCFrontmatterMap: Tag.define(),
  LiquidOutputStart: Tag.define(tags.brace),
  LiquidOutputEnd: Tag.define(tags.brace),
  LiquidOutput: Tag.define()
}

export function getMarkdownConfig(): LanguageSupport {
  return markdown({
    base: markdownLanguage,
    codeLanguages: languages,
    extensions: {
      parseBlock: [
        // This BlockParser parses JSONC frontmatter
        frontmatterParser
      ],

      parseInline: [
        liquidInlineParser
      ],

      // We have to notify the markdown parser about the additional Node Types
      // that the YAML block parser utilizes
      defineNodes: [
        { name: 'JSONCFrontmatterStart', style: customTags.JSONCFrontmatterStart, block: true },
        { name: 'JSONCFrontmatterEnd', style: customTags.JSONCFrontmatterEnd, block: true },
        { name: 'JSONCFrontmatterMap', style: customTags.JSONCFrontmatterMap, block: false },

        { name: 'LiquidOutputStart', style: customTags.LiquidOutputStart, block: false },
        { name: 'LiquidOutputEnd', style: customTags.LiquidOutputEnd, block: false },
        { name: 'LiquidOutput', style: customTags.LiquidOutput, block: false }
      ]
    }
  })
}

export function getJsonConfig(): LanguageSupport {
  return json()
}

export const LANGUAGE = new Compartment;
