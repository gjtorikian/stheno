import type { Extension } from "@codemirror/state";

import { EditorView } from "@codemirror/view";

export const config = {
  activeLine: "rgba(186, 23, 186, 0.15)",
  background: "transparent",
  cursor: "#f1f5f9",
  dark: true,
  dropdownBackground: "rgba(24, 24, 27, 0.8)",
  dropdownBorder: "rgba(255, 255, 255, 0.1)",
  foreground: "#f1f5f9",
  matchingBracket: "rgba(214, 31, 218, 0.3)",
  name: "yettoDark",
  selection: "rgba(214, 31, 218, 0.3)",
};

export const yettoDarkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: config.background,
      color: config.foreground,
      fontFamily: "'IBM Plex Mono', monospace",
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

export const yettoDark: Extension = yettoDarkTheme;
