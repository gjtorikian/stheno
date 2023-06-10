import {
  keymap, highlightSpecialChars, drawSelection, dropCursor, EditorView, Command
} from "@codemirror/view"
import { EditorState, EditorSelection, ChangeSpec, type EditorStateConfig } from "@codemirror/state"
import {
  defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching, foldKeymap, LanguageSupport
} from "@codemirror/language"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete"
import { lintKeymap } from "@codemirror/lint"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { json } from "@codemirror/lang-json"

function getJsonConfig(): LanguageSupport {
  return json()
}


function getMarkdownConfig(): LanguageSupport {
  return markdown({ codeLanguages: languages, base: markdownLanguage })
}

export function wrapText(mark: string, view: EditorView): void {
  view.dispatch(view.state.changeByRange(range => ({
    changes: [{ from: range.from, insert: mark }, { from: range.to, insert: mark }],
    range: EditorSelection.range(range.from + mark.length, range.to + mark.length)
  })))
}

function makeWrapTextCommand(mark: string): Command {
  return (view: EditorView): boolean => {
    wrapText(mark, view)
    return true
  }
}

export function prependLines(mark: string, view: EditorView): void {
  view.dispatch(view.state.changeByRange(range => {
    const changes: ChangeSpec[] = [];
    let firstLine = view.state.doc.lineAt(range.from).number;
    let lastLine = view.state.doc.lineAt(range.to).number;

    // Iterate over the lines
    for (let i = firstLine; i <= lastLine; i++) {
      let line = view.state.doc.line(i);
      // Create a change that inserts the string at the start of the line
      changes.push({ from: line.from, insert: mark });
    }

    return {
      range: EditorSelection.range(range.from, range.to),
      changes
    }
  }))
}

function makePrependLinesCommand(mark: string): Command {
  return (view: EditorView): boolean => {
    prependLines(mark, view)
    return true
  }
}

export function getSthenoConfig(lang: String): EditorStateConfig {
  const language = lang === 'markdown' ? getMarkdownConfig() : getJsonConfig()

  const config: EditorStateConfig = {
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
        ...lintKeymap,
        indentWithTab,
      ]),
      language,
    ],
  }

  return config
}
