# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stheno is an opinionated CodeMirror configuration library. It provides a pre-configured editor state with markdown support, JSONC frontmatter parsing, Liquid templating, theming, and custom keybindings.

## Commands

```bash
# Development server (serves ./dev directory)
npm run dev

# Run integration tests
npm run test

# Run all tests
npm run test:all

# Build
npm run prepare       # Rolldown build + TypeScript declarations
```

## Architecture

### Entry Point (`src/index.ts`)
- `getSthenoConfig(lang, ...extensions)` - Main entry point returning EditorState configuration
- `sthenoConfig()` - Returns array of CodeMirror extensions
- `setupThemeListener(editorView)` - Handles system dark/light mode changes
- Re-exports commands and decorations for external use

### Language Configuration (`src/config.ts`)
- `markdownWithJSONCFrontmatterConfig()` - Combines Liquid → Markdown → JSONC frontmatter
- Uses CodeMirror Compartments for dynamic language switching (`LANGUAGE`)
- Custom Lezer tags defined in `customTags` for frontmatter parsing

### Extensions Structure

**Commands (`src/extensions/markdown/commands/`)**
- `inline.ts` - `createWrapTextCommand()` for inline formatting (bold, italic, code)
- `block.ts` - `createMultiLineCommand()` for block formatting (lists, quotes)
- Individual command files `export KeyBinding` objects (BoldText, ItalicText, etc.)

**Decorations (`src/extensions/markdown/decorations/`)**
- `image.ts` - Image preview decorations
- `lists.ts` - List styling decorations

**Keybindings (`src/extensions/keybinding.ts`)**
- Uses CodeMirror Compartment (`KEYBINDINGS`) for dynamic keybinding configuration
- Custom Tab handling with indent support

### Theming (`src/themes/`)
- `yettoLight.ts` / `yettoDark.ts` - Theme definitions
- Uses Compartment (`THEME`) for runtime theme switching
- `toggleTheme`, `setDarkTheme`, `setLightTheme` commands available
- Syntax highlighting in `src/highlightStyles.ts`

### Key Design Patterns
- **Compartments**: Used throughout for runtime reconfiguration (THEME, LANGUAGE, KEYBINDINGS)
- **Command pattern**: Commands return `boolean` indicating success, receive `EditorView`
- **Tree walking**: Commands use `syntaxTree()` to traverse AST for context-aware behavior
