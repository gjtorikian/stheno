import {
  keymap, highlightSpecialChars, drawSelection, dropCursor, EditorView
} from "@codemirror/view"
import { EditorState, Extension, type EditorStateConfig } from "@codemirror/state"
import { indentOnInput, bracketMatching, foldKeymap } from "@codemirror/language"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap, CompletionContext } from "@codemirror/autocomplete"
import { lintKeymap } from "@codemirror/lint"
import { getMarkdownConfig, getJsonConfig, LANGUAGE } from "./config"
import { yettoLight, THEME } from "./themes"
import { BoldText, BulletedList, CodeText, ItalicText, NumberedList, QuoteText, TaskList, markdownCompletions } from "./extensions"
export { wrapText, makeWrapTextCommand, prependLines, makePrependLinesCommand, NumberedList, BulletedList, TaskList, QuoteText } from "./extensions"
export { yettoDark, yettoLight, THEME, toggleTheme } from "./themes"

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
        NumberedList,
        BulletedList,
        TaskList,
        QuoteText,
        BoldText,
        ItalicText,
        CodeText,
        indentWithTab,
        ...defaultKeymap,
        ...lintKeymap,
        ...completionKeymap,
        ...historyKeymap,
        ...searchKeymap,
        ...closeBracketsKeymap,
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
