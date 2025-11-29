import type { Command, EditorView } from "@codemirror/view";

import { Compartment } from "@codemirror/state";

import { yettoDark } from "./yettoDark";
import { yettoLight } from "./yettoLight";

export { yettoDark } from "./yettoDark";
export { yettoLight } from "./yettoLight";

export const THEME = new Compartment();

export const toggleTheme: Command = (view: EditorView) => {
  const newTheme = THEME.get(view.state) == yettoLight ? yettoDark : yettoLight;

  view.dispatch({
    effects: [THEME.reconfigure(newTheme)],
  });

  return true;
};

export const setDarkTheme: Command = (view: EditorView) => {
  view.dispatch({
    effects: [THEME.reconfigure(yettoDark)],
  });

  return true;
};

export const setLightTheme: Command = (view: EditorView) => {
  view.dispatch({
    effects: [THEME.reconfigure(yettoLight)],
  });

  return true;
};
