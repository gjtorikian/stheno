import type { Extension } from "@codemirror/state";

import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { history } from "@codemirror/commands";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { highlightSelectionMatches } from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import { drawSelection, dropCursor, EditorView, highlightSpecialChars } from "@codemirror/view";

import { LANGUAGE, markdownWithFrontmatterConfig } from "./config";
import { KEYBINDINGS, keymaps } from "./extensions/keybinding";
import { sthenoHighlighting, THEME, yettoDark, yettoLight } from "./themes/index";

// Auto-inject CSS styles on import
import "./styles/inject";

// Re-export disableable decorations
export { images } from "./extensions/markdown/decorations/leaf_block/image";

// Re-export event system for programmatic use
export {
  createEventExtensions,
  type SthenoEventHandlers,
  type SelectionRange,
  type ViewUpdate,
} from "./events";

// Re-export style utilities
export { injectStyles, removeStyles, getStyles } from "./styles/inject";

// Re-export theme system
export {
  THEME,
  toggleTheme,
  setDarkTheme,
  setLightTheme,
  yettoDark,
  yettoLight,
  sthenoHighlighting,
  sthenoHighlightStyle,
} from "./themes/index";

// Re-export compartments for advanced usage
export { LANGUAGE } from "./config";
export { KEYBINDINGS } from "./extensions/keybinding";

import { fencedCode, languageCompletions } from "./extensions/markdown/decorations/leaf_block/fenced_code";
import { frontmatter } from "./extensions/markdown/decorations/leaf_block/frontmatter";
import { heading } from "./extensions/markdown/decorations/leaf_block/heading";
import { horizontalRule } from "./extensions/markdown/decorations/leaf_block/horizontal_rule";
import { inlineCode } from "./extensions/markdown/decorations/inline/code";
import { lists } from "./extensions/markdown/decorations/container_block/lists";

// Re-export commands for programmatic use (toolbar buttons, etc.)
export { createWrapTextCommand } from "./extensions/markdown/commands/inline";
export { createMultiLineCommand } from "./extensions/markdown/commands/container_block";
export { createLeafBlockCommand } from "./extensions/markdown/commands/leaf_block";

// Re-export keybindings (for keyboard shortcuts)
export {
  BoldText,
  BulletedList,
  CodeText,
  FencedCode,
  HorizontalRule,
  ItalicText,
  LinkText,
  OrderedList,
  QuoteBlock,
  StrikethroughText,
  TaskList,
} from "./extensions/markdown/commands/index";

// SSR-safe check for dark color scheme preference
const darkColorScheme =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

export const setupThemeListener = (editorView: EditorView) => {
  // SSR guard
  if (typeof window === "undefined") return;

  // Set initial data-theme attribute based on current color scheme (page-wide)
  if (darkColorScheme) {
    document.documentElement.dataset.theme = "dark";
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches }) => {
    editorView.dispatch({
      effects: THEME.reconfigure(matches ? yettoDark : yettoLight),
    });
    // Toggle CSS variable scope for syntax highlighting colors (page-wide)
    if (matches) {
      document.documentElement.dataset.theme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
    }
  });
};

export const sthenoConfig = () => [
  highlightSpecialChars(),
  history(),
  drawSelection(),
  dropCursor(),
  EditorView.lineWrapping,
  EditorState.allowMultipleSelections.of(true),
  autocompletion({
    override: [languageCompletions],
  }),
  highlightSelectionMatches(),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  KEYBINDINGS.of(keymaps()),
  THEME.of(darkColorScheme ? yettoDark : yettoLight),
  LANGUAGE.of(markdownWithFrontmatterConfig()),
  // language.language.data.of({
  //   autocomplete: markdownCompletions,
  // }),
  sthenoHighlighting,
  heading(),
  lists(),
  horizontalRule(),
  fencedCode(),
  frontmatter(),
  inlineCode(),
];

// Alias for backward compatibility
export const getSthenoConfig = (_lang: string, ...extensions: Extension[]) => ({
  extensions: [...sthenoConfig(), ...extensions],
});
