import { describe, it, expect, afterEach } from "vitest";

import { ensureSyntaxTree } from "@codemirror/language";
import { EditorView } from "@codemirror/view";

import { getSthenoConfig } from "../../../index";

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

describe("heading decoration", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  it("applies stheno-line-h1 and stheno-header-inside to # heading line", () => {
    view = createTestEditor("# Heading 1");
    const line = view.dom.querySelector(".stheno-line-h1");
    expect(line).not.toBeNull();
    expect(line?.classList.contains("stheno-header-inside")).toBe(true);
    expect(line?.textContent).toContain("Heading 1");
  });

  it("applies stheno-h1 mark to heading content", () => {
    view = createTestEditor("# Heading 1");
    const mark = view.dom.querySelector(".stheno-h1");
    expect(mark).not.toBeNull();
  });

  it("applies stheno-line-h2 to ## heading line", () => {
    view = createTestEditor("## Heading 2");
    const line = view.dom.querySelector(".stheno-line-h2");
    expect(line).not.toBeNull();
    expect(line?.textContent).toContain("Heading 2");
  });

  it("applies stheno-line-h3 to ### heading line", () => {
    view = createTestEditor("### Heading 3");
    const line = view.dom.querySelector(".stheno-line-h3");
    expect(line).not.toBeNull();
    expect(line?.textContent).toContain("Heading 3");
  });

  it("applies stheno-line-h4 to #### heading line", () => {
    view = createTestEditor("#### Heading 4");
    const line = view.dom.querySelector(".stheno-line-h4");
    expect(line).not.toBeNull();
    expect(line?.textContent).toContain("Heading 4");
  });

  it("applies stheno-line-h5 to ##### heading line", () => {
    view = createTestEditor("##### Heading 5");
    const line = view.dom.querySelector(".stheno-line-h5");
    expect(line).not.toBeNull();
    expect(line?.textContent).toContain("Heading 5");
  });

  it("applies stheno-line-h6 to ###### heading line", () => {
    view = createTestEditor("###### Heading 6");
    const line = view.dom.querySelector(".stheno-line-h6");
    expect(line).not.toBeNull();
    expect(line?.textContent).toContain("Heading 6");
  });

  it("handles multiple headings in document", () => {
    view = createTestEditor("# H1\n\n## H2\n\n### H3");
    expect(view.dom.querySelector(".stheno-line-h1")).not.toBeNull();
    expect(view.dom.querySelector(".stheno-line-h2")).not.toBeNull();
    expect(view.dom.querySelector(".stheno-line-h3")).not.toBeNull();
  });

  it("applies heading class in context with other content", () => {
    view = createTestEditor("some text\n\n# Heading\n\nmore text");
    const line = view.dom.querySelector(".stheno-line-h1");
    expect(line).not.toBeNull();
    expect(line?.textContent).toContain("Heading");
  });
});
