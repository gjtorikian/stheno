import type { Extension } from "@codemirror/state";

import { fencedCodeBackgroundPlugin } from "./background";

/**
 * Fenced code block decorations.
 *
 * Includes:
 * - Gray background on all lines (including fence lines)
 */
export const fencedCode = (): Extension => {
  return [fencedCodeBackgroundPlugin()];
};

export { findLanguage, SUPPORTED_LANGUAGES } from "./languages";
export { languageCompletions } from "./language_autocomplete";
