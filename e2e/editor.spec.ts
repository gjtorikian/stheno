import { test, expect } from "@playwright/test";

// Use Meta (Cmd) on macOS, Control on other platforms
const mod = process.platform === "darwin" ? "Meta" : "Control";

test.describe("Editor keyboard shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".cm-editor");
  });

  test("Ctrl+B wraps selection in bold", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("hello");

    // Select all
    await page.keyboard.press(`${mod}+a`);

    // Apply bold
    await page.keyboard.press(`${mod}+b`);

    const content = await editor.textContent();
    expect(content).toContain("**hello**");
  });

  test("Ctrl+I wraps selection in italic", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("hello");

    await page.keyboard.press(`${mod}+a`);
    await page.keyboard.press(`${mod}+i`);

    const content = await editor.textContent();
    expect(content).toContain("_hello_");
  });

  test("Ctrl+E wraps selection in code", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("hello");

    await page.keyboard.press(`${mod}+a`);
    await page.keyboard.press(`${mod}+e`);

    const content = await editor.textContent();
    expect(content).toContain("`hello`");
  });

  test("Ctrl+Shift+. adds blockquote", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("quote me");

    await page.keyboard.press(`${mod}+Shift+.`);

    const content = await editor.textContent();
    expect(content).toContain("> quote me");
  });

  test("Ctrl+Shift+7 adds ordered list", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("list item");

    await page.keyboard.press(`${mod}+Shift+7`);

    const content = await editor.textContent();
    expect(content).toContain("1. list item");
  });

  test("Ctrl+Shift+8 adds unordered list", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("list item");

    await page.keyboard.press(`${mod}+Shift+8`);

    const content = await editor.textContent();
    expect(content).toContain("* list item");
  });
});

test.describe("Toolbar buttons", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".cm-editor");
  });

  test("Bold button wraps selection", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("hello world");

    // Select all
    await page.keyboard.press(`${mod}+a`);

    // Click bold button
    await page.locator("md-bold").click();

    const content = await editor.textContent();
    expect(content).toContain("**");
  });

  test("Italic button wraps selection", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("hello world");
    await page.keyboard.press(`${mod}+a`);

    await page.locator("md-italic").click();

    const content = await editor.textContent();
    expect(content).toContain("*hello world*");
  });

  test("Code button wraps selection", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("code here");
    await page.keyboard.press(`${mod}+a`);

    await page.locator("md-code").click();

    const content = await editor.textContent();
    expect(content).toContain("`");
  });

  test("Quote button prepends >", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("quote me");

    await page.locator("md-quote").click();

    const content = await editor.textContent();
    expect(content).toContain(">");
  });

  test("Unordered list button prepends *", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("list item");

    await page.locator("md-unordered-list").click();

    const content = await editor.textContent();
    expect(content).toContain("* list item");
  });

  test("Ordered list button prepends 1.", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("list item");

    await page.locator("md-ordered-list").click();

    const content = await editor.textContent();
    expect(content).toContain("1. list item");
  });
});

test.describe("Visual rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".cm-editor");
  });

  test("editor displays content correctly", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("**bold text**");

    // Verify content is displayed
    await expect(editor).toContainText("bold text");
  });

  test("code blocks render properly", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("```\ncode block\n```");

    await expect(editor).toContainText("code block");
  });

  test("frontmatter renders correctly", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type('---\n{\n  "title": "Test"\n}\n---');

    await expect(editor).toContainText("title");
  });

  test("multiple formatting types coexist", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("# Heading\n\n**bold** and *italic*\n\n> quote");

    await expect(editor).toContainText("Heading");
    await expect(editor).toContainText("bold");
    await expect(editor).toContainText("italic");
    await expect(editor).toContainText("quote");
  });
});

test.describe("Toggle behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".cm-editor");
  });

  test("bold toggles off when applied to bold text", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();

    // Type plain text and apply bold via keyboard shortcut
    await page.keyboard.type("hello");
    await page.keyboard.press(`${mod}+a`);
    await page.keyboard.press(`${mod}+b`);

    // Wait for syntax tree to parse
    await page.waitForTimeout(100);

    // Verify bold was applied
    const afterBold = await page.evaluate(() => {
      const controller = document.querySelector('[data-controller="stheno"]');
      // @ts-ignore - accessing Stimulus controller for CodeMirror view
      const app = window.Stimulus;
      const sthenoController = app?.getControllerForElementAndIdentifier(controller, "stheno");
      return sthenoController?.view?.state.doc.toString();
    });
    expect(afterBold).toBe("**hello**");

    // Select only "hello" (positions 2-7), not the ** markers
    // Move to start, skip past opening **, then select 5 chars
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Shift+ArrowRight");
    }

    // Toggle bold off
    await page.keyboard.press(`${mod}+b`);

    // Get the actual CodeMirror document content
    const content = await page.evaluate(() => {
      const controller = document.querySelector('[data-controller="stheno"]');
      // @ts-ignore - accessing Stimulus controller for CodeMirror view
      const app = window.Stimulus;
      const sthenoController = app?.getControllerForElementAndIdentifier(controller, "stheno");
      return sthenoController?.view?.state.doc.toString();
    });

    // Should have removed the ** markers
    expect(content).toBe("hello");
  });
});
