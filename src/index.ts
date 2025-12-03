import type { Extension } from "@codemirror/state";

import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { history } from "@codemirror/commands";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { highlightSelectionMatches } from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import { drawSelection, dropCursor, EditorView, highlightSpecialChars } from "@codemirror/view";

import { LANGUAGE, markdownWithJSONCFrontmatterConfig } from "./config";
import { KEYBINDINGS, keymaps } from "./extensions/keybinding";
import { sthenoHighlighting, THEME, yettoDark, yettoLight } from "./themes/index";

// Re-export disableable decorations
export { images } from "./extensions/markdown/decorations/image";

import { horizontalRule } from "./extensions/markdown/decorations/horizontal_rule";
import { lists } from "./extensions/markdown/decorations/lists";

// Re-export commands for programmatic use (toolbar buttons, etc.)
export { createWrapTextCommand } from "./extensions/markdown/commands/inline";
export { createMultiLineCommand } from "./extensions/markdown/commands/container_block";
export { createLeafBlockCommand } from "./extensions/markdown/commands/leaf_block";

// Re-export keybindings (for keyboard shortcuts)
export {
  BoldText,
  BulletedList,
  CodeText,
  HorizontalRule,
  ItalicText,
  OrderedList,
  QuoteBlock,
  StrikethroughText,
  TaskList,
} from "./extensions/markdown/commands/index";

const darkColorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

export const setupThemeListener = (editorView: EditorView) => {
  // Set initial data-theme attribute based on current color scheme
  if (darkColorScheme) {
    editorView.dom.dataset.theme = "dark";
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches }) => {
    editorView.dispatch({
      effects: THEME.reconfigure(matches ? yettoDark : yettoLight),
    });
    // Toggle CSS variable scope for syntax highlighting colors
    if (matches) {
      editorView.dom.dataset.theme = "dark";
    } else {
      delete editorView.dom.dataset.theme;
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
  autocompletion(),
  highlightSelectionMatches(),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  KEYBINDINGS.of(keymaps()),
  THEME.of(darkColorScheme ? yettoDark : yettoLight),
  LANGUAGE.of(markdownWithJSONCFrontmatterConfig()),
  // language.language.data.of({
  //   autocomplete: markdownCompletions,
  // }),
  sthenoHighlighting,
  lists(),
  horizontalRule(),
];

// Alias for backward compatibility
export const getSthenoConfig = (_lang: string, ...extensions: Extension[]) => ({
  extensions: [...sthenoConfig(), ...extensions],
});
