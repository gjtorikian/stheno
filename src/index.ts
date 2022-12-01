import {
  keymap, highlightSpecialChars, drawSelection, dropCursor, EditorView
} from "@codemirror/view"
import { EditorState, type EditorStateConfig } from "@codemirror/state"
import {
  defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching, foldKeymap
} from "@codemirror/language"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete"
import { lintKeymap } from "@codemirror/lint"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"


export const SthenoConfig: EditorStateConfig = {
  extensions: [
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
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
      ...lintKeymap
    ]),
    markdown({ codeLanguages: languages, base: markdownLanguage })
  ],
}
