import type { Completion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";

import { syntaxTree } from "@codemirror/language";

import { SUPPORTED_LANGUAGES } from "./languages";

// Build completion options from supported languages
const languageOptions: Completion[] = SUPPORTED_LANGUAGES.filter((lang) => lang.name !== "").map(
  (lang) => ({
    label: lang.name,
    displayLabel: lang.label,
    type: "type",
  }),
);

export function languageCompletions(context: CompletionContext): CompletionResult | null {
  const { state, pos } = context;
  const tree = syntaxTree(state);

  // Walk up from cursor position to find relevant nodes
  const node = tree.resolveInner(pos, -1);

  // Check if we're inside a CodeInfo node (existing language text)
  if (node.name === "CodeInfo") {
    const from = node.from;
    return {
      from,
      options: languageOptions,
      validFor: /^\w*$/,
    };
  }

  // Check if we're right after CodeMark (the opening ```)
  // Walk up to find if we're on a fenced code opening line
  let current = node;
  while (current.parent) {
    if (current.name === "FencedCode") {
      // Found a fenced code block, check if we're on the opening line
      const codeMark = current.getChild("CodeMark");
      if (codeMark && pos >= codeMark.to) {
        // Check we're on the same line as the CodeMark
        const codeMarkLine = state.doc.lineAt(codeMark.from).number;
        const cursorLine = state.doc.lineAt(pos).number;

        if (codeMarkLine === cursorLine) {
          // Check if there's already a CodeInfo node
          const codeInfo = current.getChild("CodeInfo");

          if (codeInfo) {
            // Only trigger if cursor is within the CodeInfo bounds
            if (pos >= codeInfo.from && pos <= codeInfo.to) {
              return {
                from: codeInfo.from,
                options: languageOptions,
                validFor: /^\w*$/,
              };
            }
          } else {
            // No CodeInfo yet, trigger right after CodeMark
            const lineText = state.doc.lineAt(pos).text;
            const codeMarkEndInLine = codeMark.to - state.doc.lineAt(codeMark.from).from;

            // Get the text after the backticks
            const afterBackticks = lineText.slice(codeMarkEndInLine);
            const match = afterBackticks.match(/^(\w*)$/);

            if (match) {
              return {
                from: codeMark.to,
                options: languageOptions,
                validFor: /^\w*$/,
              };
            }
          }
        }
      }
      break;
    }
    current = current.parent;
  }

  return null;
}
