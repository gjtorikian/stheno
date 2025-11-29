import type { LanguageSupport } from "@codemirror/language";

import { liquid } from "@codemirror/lang-liquid";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { Compartment } from "@codemirror/state";
import { Tag, tags } from "@lezer/highlight";

import { frontmatterParser } from "./extensions/markdown/frontmatter-parser";

const customTags = {
  JSONCFrontmatterEnd: Tag.define(tags.contentSeparator),
  JSONCFrontmatterMap: Tag.define(),
  JSONCFrontmatterStart: Tag.define(tags.contentSeparator),
  LiquidOutput: Tag.define(),
  LiquidOutputEnd: Tag.define(tags.brace),
  LiquidOutputStart: Tag.define(tags.brace),
};

export function markdownWithJSONCFrontmatterConfig(): LanguageSupport {
  return liquid({
    base: markdown({
      base: markdownLanguage,
      codeLanguages: languages,
      extensions: {
        // We have to notify the markdown parser about the additional Node Types
        // that the YAML block parser utilizes
        defineNodes: [
          {
            block: true,
            name: "JSONCFrontmatterStart",
            style: customTags.JSONCFrontmatterStart,
          },
          {
            block: true,
            name: "JSONCFrontmatterEnd",
            style: customTags.JSONCFrontmatterEnd,
          },
          {
            block: false,
            name: "JSONCFrontmatterMap",
            style: customTags.JSONCFrontmatterMap,
          },
        ],

        parseBlock: [
          // This BlockParser parses JSONC frontmatter
          frontmatterParser,
        ],
      },
    }),
  });
}

export const LANGUAGE = new Compartment();
