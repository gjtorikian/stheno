import {
  highlightSpecialChars, drawSelection, dropCursor, EditorView
} from "@codemirror/view";
import { EditorState, Extension, type EditorStateConfig } from "@codemirror/state";
import { indentOnInput, bracketMatching } from "@codemirror/language";
import { history } from "@codemirror/commands";
import { highlightSelectionMatches } from "@codemirror/search";
import { autocompletion, closeBrackets } from "@codemirror/autocomplete";
import { getMarkdownConfig, getJsonConfig, LANGUAGE } from "./config";
import { yettoLight, THEME } from "./themes";
import { markdownCompletions } from "./extensions/markdown";
export { wrapText, makeWrapTextCommand, prependLines, makePrependLinesCommand, NumberedList, BulletedList, TaskList, QuoteText, images } from "./extensions/markdown";
export { yettoDark, yettoLight, THEME, toggleTheme, setDarkTheme, setLightTheme } from "./themes";
import { KEYBINDINGS, keymaps } from "./extensions/keybinding";

export function getSthenoConfig(lang: String, ...extensions: Extension[]): EditorStateConfig {
  const language = lang === 'markdown' ? getMarkdownConfig() : getJsonConfig()

  const config: EditorStateConfig = {
    extensions: [
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
      THEME.of(yettoLight),
      LANGUAGE.of(language),
      language.language.data.of({
        autocomplete: markdownCompletions
      }),
      ...extensions,
    ],
  }

  return config
}
