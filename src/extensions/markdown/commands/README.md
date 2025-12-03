Commands are make like this:

## Inline commands

Create the command, like, `bold_text.ts`.

Add the `key`bindings for Windows/Linux via `key`, and `mac` for macOS.

Within the `KeyBinding`, define a function to `run`.

In that function, call `createWrapTextCommand`, pass in the `NodeName` and the character to wrap with.

### Samples:

- `bold_text.ts`
- `code_text.ts`
- `italic_text.ts`
