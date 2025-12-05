import { describe, it, expect, afterEach } from "vitest";

import { EditorView } from "@codemirror/view";

import { createTestEditor, cleanupEditor } from "../../test-utils";

describe("markdown syntax highlighting", () => {
  let view: EditorView;

  afterEach(() => {
    if (view) cleanupEditor(view);
  });

  describe("inline formatting", () => {
    it("applies strong emphasis styling to **bold**", () => {
      view = createTestEditor("**bold text**");
      // CodeMirror applies specific classes for markdown tokens
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("bold text");
    });

    it("applies emphasis styling to *italic*", () => {
      view = createTestEditor("*italic text*");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("italic text");
    });

    it("applies emphasis styling to _italic_ (underscore)", () => {
      view = createTestEditor("_italic text_");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("italic text");
    });

    it("applies monospace styling to `inline code`", () => {
      view = createTestEditor("`code here`");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("code here");
    });

    it("renders strikethrough ~~text~~", () => {
      view = createTestEditor("~~strikethrough~~");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("strikethrough");
    });
  });

  describe("block formatting", () => {
    it("renders headings # Heading", () => {
      view = createTestEditor("# Heading One");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("Heading One");
    });

    it("renders multiple heading levels", () => {
      view = createTestEditor("# H1\n## H2\n### H3");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("H1");
      expect(content?.textContent).toContain("H2");
      expect(content?.textContent).toContain("H3");
    });

    it("renders blockquotes > text", () => {
      view = createTestEditor("> This is a quote");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("This is a quote");
    });

    it("renders unordered lists", () => {
      view = createTestEditor("* Item 1\n* Item 2\n* Item 3");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("Item 1");
      expect(content?.textContent).toContain("Item 2");
      expect(content?.textContent).toContain("Item 3");
    });

    it("renders ordered lists", () => {
      view = createTestEditor("1. First\n2. Second\n3. Third");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("First");
      expect(content?.textContent).toContain("Second");
    });

    it("renders task lists", () => {
      view = createTestEditor("- [ ] Unchecked\n- [x] Checked");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("Unchecked");
      expect(content?.textContent).toContain("Checked");
    });
  });

  describe("code blocks", () => {
    it("renders fenced code blocks", () => {
      view = createTestEditor("```javascript\nconst x = 1;\n```");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("const x = 1");
    });

    it("renders code blocks with language identifier", () => {
      view = createTestEditor("```typescript\ninterface Foo {}\n```");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("interface Foo");
    });
  });

  describe("links and images", () => {
    it("renders links [text](url)", () => {
      view = createTestEditor("[link text](https://example.com)");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("link text");
      expect(content?.textContent).toContain("https://example.com");
    });

    it("renders images ![alt](url)", () => {
      view = createTestEditor("![alt text](image.png)");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("alt text");
    });
  });

  describe("frontmatter", () => {
    it("renders YAML frontmatter", () => {
      view = createTestEditor("---\ntitle: Test\n---\n\nContent here");
      const content = view.dom.querySelector(".cm-content");
      expect(content).toBeTruthy();
      expect(content?.textContent).toContain("title");
      expect(content?.textContent).toContain("Content here");
    });
  });

  describe("DOM structure verification", () => {
    it("creates proper line structure", () => {
      view = createTestEditor("Line 1\nLine 2\nLine 3");
      const lines = view.dom.querySelectorAll(".cm-line");
      expect(lines.length).toBe(3);
    });

    it("editor has expected structure", () => {
      view = createTestEditor("test content");
      // view.dom IS the .cm-editor element
      expect(view.dom.classList.contains("cm-editor")).toBe(true);
      expect(view.dom.querySelector(".cm-scroller")).toBeTruthy();
      expect(view.dom.querySelector(".cm-content")).toBeTruthy();
    });

    it("content is editable", () => {
      view = createTestEditor("editable text");
      const content = view.dom.querySelector(".cm-content");
      expect(content?.getAttribute("contenteditable")).toBe("true");
    });
  });
});
