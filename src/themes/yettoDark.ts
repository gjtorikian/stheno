import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";

export const config = {
  activeLine: "rgba(186, 23, 186, 0.15)",
  background: "transparent",
  class: "#ee3ff6",
  comment: "#94a3b8",
  constant: "#f874fe",
  cursor: "#f1f5f9",
  dark: true,
  dropdownBackground: "rgba(24, 24, 27, 0.8)",
  dropdownBorder: "rgba(255, 255, 255, 0.1)",
  foreground: "#f1f5f9",
  function: "#ba17ba",
  heading: "#ee3ff6",
  invalid: "#ef4444",
  keyword: "#d61fda",
  matchingBracket: "rgba(214, 31, 218, 0.3)",
  name: "yettoDark",
  number: "#f874fe",
  parameter: "#fb923c",
  regexp: "#ee3ff6",
  selection: "rgba(214, 31, 218, 0.3)",
  storage: "#d61fda",
  string: "#f874fe",
  type: "#ee3ff6",
  variable: "#fb923c",
};

export const yettoDarkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: config.background,
      color: config.foreground,
    },

    "&.cm-editor": {
      height: "100px",
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
      backgroundColor: "transparent",
      border: "none",
      color: config.foreground,
    },
    ".cm-panels": {
      backdropFilter: "blur(4px)",
      backgroundColor: config.dropdownBackground,
      color: config.foreground,
    },

    ".cm-panels.cm-panels-bottom": {
      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
    },
    ".cm-panels.cm-panels-top": {
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },

    ".cm-searchMatch": {
      backgroundColor: config.dropdownBackground,
      outline: `1px solid ${config.dropdownBorder}`,
    },

    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: config.selection,
    },
    ".cm-selectionMatch": { backgroundColor: config.selection },

    ".cm-tooltip": {
      backdropFilter: "blur(4px)",
      backgroundColor: "rgba(38, 38, 38, 0.8)",
      border: `1px solid ${config.dropdownBorder}`,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
      color: config.foreground,
    },
    ".cm-tooltip-autocomplete": {
      "& .cm-completion-active": {
        backgroundColor: "rgba(214, 31, 218, 0.2)",
        borderRadius: "4px",
      },
      "& .cm-completionIcon": {
        display: "none",
      },
      "& .cm-completionLabel": {
        color: "#f1f5f9",
        display: "block",
        fontSize: "0.95rem",
        fontWeight: "600",
      },
      "& .cm-completionMatchedText": {
        color: "#ee3ff6",
        fontWeight: "600",
        textDecoration: "none",
      },
      "& .saved-reply-info": {
        padding: "0.25rem 0 0 0",
      },
      "& .saved-reply-preview": {
        color: "#9ca3af",
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
        transition: "background-color 150ms ease",
      },
      backdropFilter: "blur(4px)",
      backgroundColor: "rgba(38, 38, 38, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "8px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      fontSize: "0.9rem",
      minWidth: "250px",
      padding: "0",
      zIndex: "100",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
      borderTopColor: "rgba(255, 255, 255, 0.1)",
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderBottomColor: "transparent",
      borderTopColor: "transparent",
    },
    "&.ͼ1.cm-focused": {
      outline: "none !important",
    },
  },
  { dark: config.dark },
);

export const yettoDarkHighlightStyle = HighlightStyle.define([
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

export const yettoDark: Extension = [
  yettoDarkTheme,
  syntaxHighlighting(yettoDarkHighlightStyle),
];
