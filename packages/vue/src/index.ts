// Main component
export { default as SthenoEditor } from "./SthenoEditor.vue";
export type {
  SthenoEditorProps,
  SthenoEditorExpose,
} from "./SthenoEditor.vue";

// Composable
export { useStheno } from "./useStheno";
export type { UseSthenoReturn } from "./useStheno";

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
