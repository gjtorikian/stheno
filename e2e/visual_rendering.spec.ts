import { test, expect } from "@playwright/test";

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
