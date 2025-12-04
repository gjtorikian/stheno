import type { Text } from "@codemirror/state";
import type { SyntaxNode } from "@lezer/common";

import { liquidLanguage } from "@codemirror/lang-liquid";
import { markdownLanguage } from "@codemirror/lang-markdown";
import { syntaxTree } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

const CODE_BLOCK_NAMES = new Set(["CodeBlock", "FencedCode"]);

export { BoldText } from "./inline/bold";
export { BulletedList } from "./container_block/unordered_list";
export { CodeText } from "./inline/code";
export { HorizontalRule } from "./leaf_block/horizontal_rule";
export { ItalicText } from "./inline/italic";
export { LinkText } from "./inline/link";
export { OrderedList } from "./container_block/ordered_list";
export { QuoteBlock } from "./container_block/quote_block";
export { StrikethroughText } from "./inline/strikethrough";
export { TaskList } from "./container_block/task_list";

export function getCodeNode(view: EditorView, pos: number, lineEndPos = false): null | SyntaxNode {
  const { state } = view;
  const tree = syntaxTree(state);
  let node: null | SyntaxNode = tree.resolve(pos, lineEndPos ? -1 : 0);

  do {
    if (
      (node.name === "InlineCode" && !lineEndPos) ||
      CODE_BLOCK_NAMES.has(node.name)
    ) {
      return node;
    }
  } while ((node = node.parent));

  if (!lineEndPos) {
    const line = state.doc.lineAt(pos);
    if (pos !== line.to - 1) {
      return getCodeNode(view, line.to, true);
    }
  }

  return null;
}

export function isMultipleLines(doc: Text, from: number, to: number) {
  return doc.lineAt(from).to < to;
}

export function isWithinMarkdown(state: EditorState, pos: number) {
  // that's because, technically, liquid is a base for markdown
  return liquidLanguage.isActiveAt(state, pos) || markdownLanguage.isActiveAt(state, pos);
}
