import { ensureSyntaxTree } from "@codemirror/language";
import { EditorState, EditorSelection } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

import { sthenoConfig } from "./index";

export function createTestEditor(doc = ""): EditorView {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const view = new EditorView({
    parent: container,
    state: EditorState.create({
      doc,
      extensions: sthenoConfig(),
    }),
  });

  // Force parsing to complete so language detection works
  ensureSyntaxTree(view.state, view.state.doc.length, 5000);

  return view;
}

export function cleanupEditor(view: EditorView): void {
  view.dom.parentElement?.remove();
  view.destroy();
}

export function setSelection(view: EditorView, from: number, to?: number): void {
  view.dispatch({
    selection: EditorSelection.single(from, to ?? from),
  });
}

export function getDoc(view: EditorView): string {
  return view.state.doc.toString();
}
