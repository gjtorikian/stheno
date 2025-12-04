import type { Extension } from "@codemirror/state";

import { fencedCodeBackgroundPlugin } from "./background";
import { languageSelectorPlugin } from "./language_selector";

/**
 * Fenced code block decorations.
 *
 * Includes:
 * - Gray background on all lines (including fence lines)
 * - Language selector dropdown in top-right corner
 */
export const fencedCode = (): Extension => {
  return [fencedCodeBackgroundPlugin(), languageSelectorPlugin()];
};

export { findLanguage, SUPPORTED_LANGUAGES } from "./languages";
