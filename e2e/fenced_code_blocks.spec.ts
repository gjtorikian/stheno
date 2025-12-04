import { test, expect } from "@playwright/test";

test.describe("Fenced code blocks", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".cm-editor");
  });

  test("fenced code block shows gray background", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("```\ncode here\n```");

    // Wait for decorations to be applied
    await page.waitForSelector(".stheno-fenced-code-line");

    const codeLines = page.locator(".stheno-fenced-code-line");
    await expect(codeLines).toHaveCount(3);
  });

  test("language selector appears on fenced code block", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("```\ncode\n```");

    // Wait for the language selector widget to appear
    await page.waitForSelector(".stheno-language-selector");

    const selector = page.locator(".stheno-language-selector");
    await expect(selector).toBeVisible();
  });

  test("language selector shows current language", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("```javascript\nconst x = 1;\n```");

    await page.waitForSelector(".stheno-language-select");

    const select = page.locator(".stheno-language-select");
    await expect(select).toHaveValue("javascript");
  });

  test("changing language via selector updates document", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("```javascript\ncode\n```");

    await page.waitForSelector(".stheno-language-select");

    const select = page.locator(".stheno-language-select");
    await select.selectOption("python");

    // Verify the document was updated
    const content = await page.evaluate(() => {
      const controller = document.querySelector('[data-controller="stheno"]');
      // @ts-ignore
      const app = window.Stimulus;
      const sthenoController = app?.getControllerForElementAndIdentifier(controller, "stheno");
      return sthenoController?.view?.state.doc.toString();
    });

    expect(content).toContain("```python");
    expect(content).not.toContain("javascript");
  });

  test("adding language to empty code block via selector", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("```\ncode\n```");

    await page.waitForSelector(".stheno-language-select");

    const select = page.locator(".stheno-language-select");
    // Initially should be empty (Plain Text)
    await expect(select).toHaveValue("");

    // Select Python
    await select.selectOption("python");

    // Verify the document was updated with the language
    const content = await page.evaluate(() => {
      const controller = document.querySelector('[data-controller="stheno"]');
      // @ts-ignore
      const app = window.Stimulus;
      const sthenoController = app?.getControllerForElementAndIdentifier(controller, "stheno");
      return sthenoController?.view?.state.doc.toString();
    });

    expect(content).toContain("```python");
  });

  test("clicking selector does not move cursor into code block", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("Some text before\n\n```javascript\ncode\n```\n\nSome text after");

    await page.waitForSelector(".stheno-language-select");

    // Click on the language selector
    const select = page.locator(".stheno-language-select");
    await select.click();

    // The selector should still be visible and interactive
    await expect(select).toBeVisible();
  });

  test("multiple code blocks have separate selectors", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("```javascript\ncode1\n```\n\n```python\ncode2\n```");

    await page.waitForSelector(".stheno-language-select");

    const selectors = page.locator(".stheno-language-select");
    await expect(selectors).toHaveCount(2);

    // Verify each has the correct language
    await expect(selectors.first()).toHaveValue("javascript");
    await expect(selectors.last()).toHaveValue("python");
  });
});
