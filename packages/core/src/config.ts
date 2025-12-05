import type { LanguageSupport } from "@codemirror/language";

import { liquid } from "@codemirror/lang-liquid";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { Compartment } from "@codemirror/state";
import { Tag, tags } from "@lezer/highlight";
import { GFM } from "@lezer/markdown";

import { frontmatterParser } from "./extensions/markdown/frontmatter-parser";

export const customTags = {
  FrontmatterContent: Tag.define(),
  FrontmatterEnd: Tag.define(tags.contentSeparator),
  FrontmatterStart: Tag.define(tags.contentSeparator),
  LiquidOutput: Tag.define(),
  LiquidOutputEnd: Tag.define(tags.brace),
  LiquidOutputStart: Tag.define(tags.brace),
};

export function markdownWithFrontmatterConfig(): LanguageSupport {
  return liquid({
    base: markdown({
      base: markdownLanguage,
      codeLanguages: languages,
      extensions: [
        GFM,
        {
          // We have to notify the markdown parser about the additional Node Types
          // that the frontmatter block parser utilizes
          defineNodes: [
            {
              block: true,
              name: "FrontmatterStart",
              style: customTags.FrontmatterStart,
            },
            {
              block: true,
              name: "FrontmatterEnd",
              style: customTags.FrontmatterEnd,
            },
            {
              block: false,
              name: "FrontmatterContent",
              style: customTags.FrontmatterContent,
            },
          ],

          parseBlock: [
            // This BlockParser parses YAML frontmatter
            frontmatterParser,
          ],
        },
      ],
    }),
  });
}

export const LANGUAGE = new Compartment();
