import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

import { customTags } from "./config";

export const sthenoHighlightStyle = HighlightStyle.define([
  // Keywords and operators
  { tag: t.keyword, class: "stheno-keyword" },
  { tag: [t.operator, t.operatorKeyword], class: "stheno-operator" },

  // Names and identifiers
  { tag: [t.name, t.deleted, t.character, t.macroName], class: "stheno-name" },
  { tag: t.propertyName, class: "stheno-property" },
  { tag: [t.function(t.variableName), t.labelName], class: "stheno-function" },
  { tag: [t.definition(t.name), t.separator], class: "stheno-definition" },
  { tag: t.className, class: "stheno-class" },
  { tag: t.typeName, class: "stheno-type" },

  // Literals
  {
    tag: [t.string, t.inserted, t.special(t.string)],
    class: "stheno-string",
  },
  {
    tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
    class: "stheno-number",
  },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], class: "stheno-constant" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], class: "stheno-atom" },

  // URLs and links
  { tag: [t.url, t.escape, t.regexp], class: "stheno-url" },
  { tag: t.link, class: "stheno-link" },

  // Comments and meta
  { tag: t.comment, class: "stheno-comment" },
  { tag: [t.meta, t.processingInstruction], class: "stheno-meta" },

  // Text formatting
  { tag: t.strong, class: "stheno-strong" },
  { tag: t.emphasis, class: "stheno-emphasis" },
  { tag: t.strikethrough, class: "stheno-strikethrough" },

  // Inline code
  { tag: t.monospace, class: "stheno-code" },

  // Headings
  { tag: t.heading1, class: "stheno-h1" },
  { tag: t.heading2, class: "stheno-h2" },
  { tag: t.heading3, class: "stheno-h3" },
  { tag: t.heading4, class: "stheno-h4" },
  { tag: t.heading5, class: "stheno-h5" },
  { tag: t.heading6, class: "stheno-h6" },

  // Horizontal rule
  { tag: t.contentSeparator, class: "stheno-hr" },

  // Invalid
  { tag: t.invalid, class: "stheno-invalid" },

  // Custom tags for frontmatter
  { tag: customTags.FrontmatterStart, class: "stheno-frontmatter-start" },
  { tag: customTags.FrontmatterEnd, class: "stheno-frontmatter-end" },
  { tag: customTags.FrontmatterContent, class: "stheno-frontmatter-content" },

  // Custom tags for Liquid
  { tag: customTags.LiquidOutput, class: "stheno-liquid-output" },
  { tag: customTags.LiquidOutputStart, class: "stheno-liquid-brace" },
  { tag: customTags.LiquidOutputEnd, class: "stheno-liquid-brace" },
]);

export const sthenoHighlighting = syntaxHighlighting(sthenoHighlightStyle);
