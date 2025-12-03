import type { Command, EditorView } from "@codemirror/view";

import { Compartment } from "@codemirror/state";

import { yettoDark } from "./yettoDark";
import { yettoLight } from "./yettoLight";

export { yettoDark } from "./yettoDark";
export { yettoLight } from "./yettoLight";
export { sthenoHighlighting, sthenoHighlightStyle } from "../highlightStyles";

export const THEME = new Compartment();

export const toggleTheme: Command = (view: EditorView) => {
  const isDark = THEME.get(view.state) === yettoDark;
  const newTheme = isDark ? yettoLight : yettoDark;

  view.dispatch({
    effects: [THEME.reconfigure(newTheme)],
  });

  // Toggle CSS variable scope for syntax highlighting colors
  view.dom.dataset.theme = isDark ? "light" : "dark";

  return true;
};

export const setDarkTheme: Command = (view: EditorView) => {
  view.dispatch({
    effects: [THEME.reconfigure(yettoDark)],
  });

  view.dom.dataset.theme = "dark";

  return true;
};

export const setLightTheme: Command = (view: EditorView) => {
  view.dispatch({
    effects: [THEME.reconfigure(yettoLight)],
  });

  delete view.dom.dataset.theme;

  return true;
};
