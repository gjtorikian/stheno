Commands are make like this:

## Inline commands

Create the command, like, `bold_text.ts`.

Add the `key` bindings for Windows/Linux via `key`, and `mac` for macOS.

Within the `KeyBinding`, define a function to `run`.

In that function, call `createWrapTextCommand`, pass in the `NodeName` and the character to wrap with.

Add the keybinding to src/extensions/keybinding.ts.

## Container block commands

Create the command, like, `bulleted_list.ts`.

Add the `key` bindings for Windows/Linux via `key`, and `mac` for macOS.

Within the `KeyBinding`, define a function to `run`.

In that function, call `createMultiLineCommand`, pass in the `NodeName` and the character to wrap with.

Add the keybinding to src/extensions/keybinding.ts.

## How Commands and Decorations Work Together

Commands and decorations are **functionally independent** but operate on the **same markdown syntax tree**.

| Aspect   | Commands                    | Decorations           |
| -------- | --------------------------- | --------------------- |
| Purpose  | Modify document text        | Style rendered output |
| Method   | Regex-based text transforms | Syntax tree analysis  |
| Location | `commands/*.ts`             | `decorations/*.ts`    |

### Data Flow

1. User triggers command (e.g., `Cmd-Shift-8` for bulleted list)
2. `createMultiLineCommand()` adds/removes text markers (`* `, `1. `, `> `, `- [ ] `)
3. Parser rebuilds syntax tree (creates `BulletList`, `ListItem`, `Task` nodes, etc.)
4. Decorations observe tree changes and apply CSS classes (`stheno-line-ul`, `stheno-list-bullet`, etc.)

Commands handle *mutation*, decorations handle *presentation*.
