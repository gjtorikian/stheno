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

  test("language autocomplete appears when typing after backticks", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("```ru");

    // Wait for autocomplete tooltip to appear
    await page.waitForSelector(".cm-tooltip-autocomplete");

    const autocomplete = page.locator(".cm-tooltip-autocomplete");
    await expect(autocomplete).toBeVisible();

    // Should show ruby in the options
    const rubyOption = page.locator(".cm-tooltip-autocomplete .cm-completionLabel").filter({ hasText: "ruby" });
    await expect(rubyOption).toBeVisible();
  });

  test("selecting from autocomplete inserts the language", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("```py");

    // Wait for autocomplete tooltip to appear
    await page.waitForSelector(".cm-tooltip-autocomplete");

    // Press Enter to accept the first completion (python)
    await page.keyboard.press("Enter");

    // Verify the document contains the language
    const content = await page.evaluate(() => {
      const controller = document.querySelector('[data-controller="stheno"]');
      // @ts-ignore
      const app = window.Stimulus;
      const sthenoController = app?.getControllerForElementAndIdentifier(controller, "stheno");
      return sthenoController?.view?.state.doc.toString();
    });

    expect(content).toContain("```python");
  });

  test("autocomplete filters languages as you type", async ({ page }) => {
    const editor = page.locator('[data-stheno-target="editor"] .cm-content');
    await editor.click();
    await page.keyboard.type("```java");

    // Wait for autocomplete tooltip to appear
    await page.waitForSelector(".cm-tooltip-autocomplete");

    // Should show filtered options (both java and javascript start with "java")
    // Check that autocomplete options contain these languages (display labels)
    const autocompleteText = await page.locator(".cm-tooltip-autocomplete").textContent();

    expect(autocompleteText).toContain("Java");
    expect(autocompleteText).toContain("JavaScript");
  });
});
