import type { Extension } from "@codemirror/state";

import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { history } from "@codemirror/commands";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { highlightSelectionMatches } from "@codemirror/search";
import { EditorState } from "@codemirror/state";
import { drawSelection, dropCursor, EditorView, highlightSpecialChars } from "@codemirror/view";

import { LANGUAGE, markdownWithJSONCFrontmatterConfig } from "./config";
import { KEYBINDINGS, keymaps } from "./extensions/keybinding";
import { THEME, yettoDark, yettoLight } from "./themes/index";

// Re-export decorations
export { images } from "./extensions/markdown/decorations/image";

// Re-export commands for programmatic use (toolbar buttons, etc.)
export { createWrapTextCommand } from "./extensions/markdown/commands/inline";
export { createPrependLinesCommand } from "./extensions/markdown/commands/block";

// Re-export keybindings (for keyboard shortcuts)
export {
  BoldText,
  BulletedList,
  CodeText,
  ItalicText,
  OrderedList,
  QuoteBlock,
  TaskList,
} from "./extensions/markdown/commands/index";

const darkColorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

export const setupThemeListener = (editorView: EditorView) => {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ({ matches }) => {
    editorView.dispatch({
      effects: THEME.reconfigure(matches ? yettoDark : yettoLight),
    });
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
];

// Alias for backward compatibility
export const getSthenoConfig = (_lang: string, ...extensions: Extension[]) => ({
  extensions: [...sthenoConfig(), ...extensions],
});
