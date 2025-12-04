import { describe, it, expect, afterEach } from "vitest";

import { ensureSyntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";

import { getSthenoConfig } from "../../../../index";

function createTestEditor(doc = ""): EditorView {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const view = new EditorView({
    parent: container,
    ...getSthenoConfig("md"),
    doc,
  });

  // Force parsing to complete so decorations are applied
  ensureSyntaxTree(view.state, view.state.doc.length, 5000);
  // Force a re-render to apply decorations
  view.dispatch({});

  return view;
}

function cleanupEditor(view: EditorView): void {
  view.dom.parentElement?.remove();
  view.destroy();
}

describe("task list decoration", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("wraps unchecked task marker with stheno-task-marker class", () => {
    view = createTestEditor("- [ ] task item");
    const marker = view.dom.querySelector(".stheno-task-marker");
    expect(marker).not.toBeNull();
    expect(marker?.textContent).toBe("[ ]");
  });

  it("wraps checked task marker with stheno-task-marker class", () => {
    view = createTestEditor("- [x] task item");
    const marker = view.dom.querySelector(".stheno-task-marker");
    expect(marker).not.toBeNull();
    expect(marker?.textContent).toBe("[x]");
  });

  it("applies stheno-task-checked class to checked tasks", () => {
    view = createTestEditor("- [x] completed task");
    const checked = view.dom.querySelector(".stheno-task-checked");
    expect(checked).not.toBeNull();
  });

  it("does not apply stheno-task-checked class to unchecked tasks", () => {
    view = createTestEditor("- [ ] incomplete task");
    const checked = view.dom.querySelector(".stheno-task-checked");
    expect(checked).toBeNull();
  });
});
