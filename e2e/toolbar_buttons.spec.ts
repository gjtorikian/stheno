import { test, expect } from "@playwright/test";

// Use Meta (Cmd) on macOS, Control on other platforms
const mod = process.platform === "darwin" ? "Meta" : "Control";

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
