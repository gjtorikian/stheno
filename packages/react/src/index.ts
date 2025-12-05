// Main component
export { SthenoEditor } from "./SthenoEditor";
export type { SthenoEditorProps, SthenoEditorRef } from "./SthenoEditor";

// Hook
export { useStheno } from "./useStheno";
export type { UseSthenoOptions, UseSthenoReturn } from "./useStheno";

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
