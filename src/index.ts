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
import { BoldText, BulletedList, CodeText, ItalicText, NumberedList, QuoteText, TaskList, images, markdownCompletions } from "./extensions/markdown"
export { wrapText, makeWrapTextCommand, prependLines, makePrependLinesCommand, NumberedList, BulletedList, TaskList, QuoteText, images } from "./extensions/markdown"
export { yettoDark, yettoLight, THEME, toggleTheme } from "./themes"
import { Compartment } from "@codemirror/state"

const KEYBINDINGS = new Compartment

export function getSthenoConfig(lang: String, extensions?: Extension[]): EditorStateConfig {
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
      KEYBINDINGS.of(keymap.of([
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
      ])),
      THEME.of(yettoLight),
      LANGUAGE.of(language),
      language.language.data.of({
        autocomplete: markdownCompletions
      }),
      images(),
    ],
  }

  return config
}
