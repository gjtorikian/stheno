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
