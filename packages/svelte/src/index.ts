// Main component
export { default as SthenoEditor } from "./SthenoEditor.svelte";

// Store
export { createSthenoStore } from "./stheno";
export type { SthenoStore } from "./stheno";

// Re-export commonly used items from core for convenience
export {
  // Commands
  createWrapTextCommand,
  createMultiLineCommand,
  createLeafBlockCommand,
  BoldText,
  ItalicText,
  CodeText,
  LinkText,
  StrikethroughText,
  BulletedList,
  OrderedList,
  TaskList,
  QuoteBlock,
  FencedCode,
  HorizontalRule,
  // Theme
  toggleTheme,
  setDarkTheme,
  setLightTheme,
  THEME,
  yettoDark,
  yettoLight,
  // Events
  createEventExtensions,
  type SthenoEventHandlers,
  type SelectionRange,
} from "@yettoapp/stheno";
