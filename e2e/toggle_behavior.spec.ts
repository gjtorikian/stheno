import { test, expect } from "@playwright/test";

// Use Meta (Cmd) on macOS, Control on other platforms
const mod = process.platform === "darwin" ? "Meta" : "Control";

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
