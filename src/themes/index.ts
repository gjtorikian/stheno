import { Command, EditorView } from "@codemirror/view"
import { yettoDark } from "./yettoDark"
import { yettoLight } from "./yettoLight"
import { Compartment } from "@codemirror/state"

export { yettoDark } from "./yettoDark"
export { yettoLight } from "./yettoLight"

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
