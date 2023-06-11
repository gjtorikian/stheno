import { Command, EditorView } from "@codemirror/view"
import { yettoDark } from "./yettoDark.ts"
import { yettoLight } from "./yettoLight.ts"
import { Compartment } from "@codemirror/state"

export { yettoDark } from "./yettoDark.ts"
export { yettoLight } from "./yettoLight.ts"

export const THEME = new Compartment;

export const toggleTheme: Command = (view: EditorView) => {
  const newTheme = THEME.get(view.state) == yettoLight ? yettoDark : yettoLight

  view.dispatch({
    effects: [
      THEME.reconfigure(newTheme),
    ]
  })

  return true
}
