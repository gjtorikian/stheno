import type { Extension } from "@codemirror/state";

import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

export const config = {
  activeLine: "#f6f8fa",
  background: "#ffffff",
  class: "#6f42c1",
  comment: "#6a737d",
  constant: "#005cc5",
  cursor: "#044289",
  dark: false,
  dropdownBackground: "#fafafa",
  dropdownBorder: "#e1e4e8",
  foreground: "#171717",
  function: "#005cc5",
  heading: "#005cc5",
  invalid: "#cb2431",
  keyword: "#d73a49",
  matchingBracket: "#34d05840",
  name: "yettoLight",
  number: "#005cc5",
  parameter: "#24292e",
  regexp: "#032f62",
  selection: "#0366d625",
  storage: "#d73a49",
  string: "#032f62",
  type: "#005cc5",
  variable: "#e36209",
};

export const yettoLightTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: config.background,
      color: config.foreground,
    },

    "&.cm-editor": {
      height: "100px",
    },

    "&.cm-focused": {
      outline: "none",
    },

    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      backgroundColor: config.matchingBracket,
      outline: "none",
    },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      { backgroundColor: config.selection },

    ".cm-activeLine": { backgroundColor: config.activeLine },
    ".cm-activeLineGutter": { backgroundColor: "rgba(217, 70, 239, 0.2)" },
    ".cm-content": { caretColor: config.cursor },

    ".cm-cursor, .cm-dropCursor": { borderLeftColor: config.cursor },
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: config.foreground,
    },

    ".cm-gutters": {
      backgroundColor: config.background,
      border: "none",
      color: config.foreground,
    },
    ".cm-panels": {
      backgroundColor: config.dropdownBackground,
      color: config.foreground,
    },

    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },

    ".cm-searchMatch": {
      backgroundColor: config.dropdownBackground,
      outline: `1px solid ${config.dropdownBorder}`,
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: config.selection,
    },

    ".cm-selectionMatch": { backgroundColor: config.selection },
    ".cm-tooltip": {
      backgroundColor: config.dropdownBackground,
      border: `1px solid ${config.dropdownBorder}`,
      color: config.foreground,
    },
    ".cm-tooltip-autocomplete": {
      "& .cm-completion-active": {
        backgroundColor: "#f3f4f6",
        borderRadius: "4px",
      },
      "& .cm-completionIcon": {
        display: "none",
      },
      "& .cm-completionLabel": {
        color: "#111827",
        display: "block",
        fontSize: "0.95rem",
        fontWeight: "600",
      },
      "& .cm-completionMatchedText": {
        color: "#3b82f6",
        fontWeight: "600",
        textDecoration: "none",
      },
      "& .saved-reply-info": {
        padding: "0.25rem 0 0 0",
      },
      "& .saved-reply-preview": {
        color: "#6b7280",
        display: "block",
        fontSize: "0.85rem",
        fontWeight: "normal",
        lineHeight: "1.3",
        whiteSpace: "pre-wrap",
      },
      "& > ul": {
        maxHeight: "350px",
        overflow: "auto",
        padding: "0.35rem",
      },
      "& li": {
        borderRadius: "4px",
        margin: "0.25rem 0",
        padding: "0.5rem",
      },
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      fontSize: "0.9rem",
      minWidth: "250px",
      padding: "0",
      zIndex: "100",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderBottomColor: config.foreground,
      borderTopColor: config.foreground,
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderBottomColor: "transparent",
      borderTopColor: "transparent",
    },
  },
  { dark: config.dark },
);

export const yettoLightHighlightStyle = HighlightStyle.define([
  { color: config.keyword, tag: t.keyword },
  {
    color: config.variable,
    tag: [t.name, t.deleted, t.character, t.macroName],
  },
  { color: config.function, tag: [t.propertyName] },
  {
    color: config.string,
    tag: [t.processingInstruction, t.string, t.inserted, t.special(t.string)],
  },
  { color: config.function, tag: [t.function(t.variableName), t.labelName] },
  {
    color: config.constant,
    tag: [t.color, t.constant(t.name), t.standard(t.name)],
  },
  { color: config.variable, tag: [t.definition(t.name), t.separator] },
  { color: config.class, tag: [t.className] },
  {
    color: config.number,
    tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
  },
  { color: config.type, fontStyle: config.type, tag: [t.typeName] },
  { color: config.keyword, tag: [t.operator, t.operatorKeyword] },
  { color: config.regexp, tag: [t.url, t.escape, t.regexp, t.link] },
  { color: config.comment, tag: [t.meta, t.comment] },
  { fontWeight: "bold", tag: t.strong },
  { fontStyle: "italic", tag: t.emphasis },
  { tag: t.link, textDecoration: "underline" },
  { color: config.heading, fontWeight: "bold", tag: t.heading },
  { color: config.variable, tag: [t.atom, t.bool, t.special(t.variableName)] },
  { color: config.invalid, tag: t.invalid },
  { tag: t.strikethrough, textDecoration: "line-through" },
]);

export const yettoLight: Extension = [
  yettoLightTheme,
  syntaxHighlighting(yettoLightHighlightStyle),
];
