import type { Extension } from "@codemirror/state";

import { frontmatterBackgroundPlugin } from "./background";

/**
 * Frontmatter block decorations.
 *
 * Includes:
 * - Cream/beige background on all frontmatter lines
 */
export const frontmatter = (): Extension => {
  return [frontmatterBackgroundPlugin()];
};
