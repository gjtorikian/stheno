import type { Extension } from "@codemirror/state";

import { EditorView } from "@codemirror/view";

import { sharedConfig } from "./shared";

export const config = {
  activeLine: "#f6f8fa",
  background: "#ffffff",
  cursor: "#044289",
  dark: false,
  dropdownBackground: "#fafafa",
  dropdownBorder: "#e1e4e8",
  foreground: "#171717",
  matchingBracket: "#34d05840",
  name: "yettoLight",
  selection: "#0366d625",
};

export const yettoLightTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: config.background,
      color: config.foreground,
      fontFamily: sharedConfig.fontFamily,
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

    ".cm-panels.cm-panels-bottom": {
      borderTop: `${sharedConfig.panelBorderWidth} solid ${config.dropdownBorder}`,
    },

    ".cm-panels.cm-panels-top": {
      borderBottom: `${sharedConfig.panelBorderWidth} solid ${config.dropdownBorder}`,
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

export const yettoLight: Extension = yettoLightTheme;
