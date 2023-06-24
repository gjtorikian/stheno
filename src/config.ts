import { LanguageSupport } from "@codemirror/language"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { json } from "@codemirror/lang-json"
import { Compartment } from "@codemirror/state"
import { Tag, tags } from '@lezer/highlight'

import { frontmatterParser } from './extensions/markdown/frontmatter-parser'

const customTags = {
  JSONCFrontmatterStart: Tag.define(tags.contentSeparator),
  JSONCFrontmatterEnd: Tag.define(tags.contentSeparator),
  JSONCFrontmatterMap: Tag.define(),
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

      // We have to notify the markdown parser about the additional Node Types
      // that the YAML block parser utilizes
      defineNodes: [
        { name: 'JSONCFrontmatterStart', style: customTags.JSONCFrontmatterStart },
        { name: 'JSONCFrontmatterEnd', style: customTags.JSONCFrontmatterEnd },
        { name: 'JSONCFrontmatterMap', style: customTags.JSONCFrontmatterMap },
      ]
    }
  })
}

export function getJsonConfig(): LanguageSupport {
  return json()
}

export const LANGUAGE = new Compartment;
