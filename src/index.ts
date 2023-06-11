import {
  keymap, highlightSpecialChars, drawSelection, dropCursor, EditorView
} from "@codemirror/view"
import { EditorState, Extension, type EditorStateConfig } from "@codemirror/state"
import { indentOnInput, bracketMatching, foldKeymap } from "@codemirror/language"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap, CompletionContext } from "@codemirror/autocomplete"
import { lintKeymap } from "@codemirror/lint"
import { getMarkdownConfig, getJsonConfig, LANGUAGE } from "./config.ts"
import { yettoLight, THEME } from "./themes/index.ts"
import { markdownCompletions } from "./extensions/index.ts"
export { wrapText, makeWrapTextCommand, prependLines, makePrependLinesCommand } from "./extensions/index.ts"
export { yettoDark, yettoLight, THEME, toggleTheme } from "./themes/index.ts"

export function getSthenoConfig(lang: String, extensions?: Extension[]): EditorStateConfig {
  const language = lang === 'markdown' ? getMarkdownConfig() : getJsonConfig()

  const config: EditorStateConfig = {
    extensions: [
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      highlightSelectionMatches(),
      EditorView.lineWrapping,
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap,
        indentWithTab,
      ]),
      THEME.of(yettoLight),
      LANGUAGE.of(language),
      language.language.data.of({
        autocomplete: markdownCompletions
      })
    ],
  }

  return config
}
