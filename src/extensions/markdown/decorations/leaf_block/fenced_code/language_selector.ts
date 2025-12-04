import type { Range } from "@codemirror/state";
import type { DecorationSet, ViewUpdate } from "@codemirror/view";

import { syntaxTree } from "@codemirror/language";
import { Decoration, EditorView, ViewPlugin, WidgetType } from "@codemirror/view";

import { iterateOverlayNodesInRange } from "../../util";
import { findLanguage, SUPPORTED_LANGUAGES } from "./languages";

interface LanguageSelectorParams {
  language: string;
  codeMarkEnd: number;
  codeInfoFrom: number | null;
  codeInfoTo: number | null;
}

class LanguageSelectorWidget extends WidgetType {
  readonly language: string;
  readonly codeMarkEnd: number;
  readonly codeInfoFrom: number | null;
  readonly codeInfoTo: number | null;

  constructor(params: LanguageSelectorParams) {
    super();
    this.language = params.language;
    this.codeMarkEnd = params.codeMarkEnd;
    this.codeInfoFrom = params.codeInfoFrom;
    this.codeInfoTo = params.codeInfoTo;
  }

  eq(other: LanguageSelectorWidget) {
    return (
      other.language === this.language &&
      other.codeMarkEnd === this.codeMarkEnd &&
      other.codeInfoFrom === this.codeInfoFrom &&
      other.codeInfoTo === this.codeInfoTo
    );
  }

  toDOM(view: EditorView) {
    const container = document.createElement("span");
    container.className = "stheno-language-selector";
    container.setAttribute("aria-hidden", "true");

    const select = document.createElement("select");
    select.className = "stheno-language-select";

    // Add language options
    for (const lang of SUPPORTED_LANGUAGES) {
      const option = document.createElement("option");
      option.value = lang.name;
      option.textContent = lang.label;

      // Check if this is the selected language (match by name or alias)
      const matchedLang = findLanguage(this.language);
      if (matchedLang && lang.name === matchedLang.name) {
        option.selected = true;
      } else if (!matchedLang && lang.name === "" && this.language === "") {
        option.selected = true;
      }

      select.appendChild(option);
    }

    // Handle language change
    select.addEventListener("change", (e) => {
      e.stopPropagation();
      const newLang = (e.target as HTMLSelectElement).value;
      this.updateLanguage(view, newLang);
    });

    // Prevent click from moving cursor
    select.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });

    container.appendChild(select);
    return container;
  }

  updateLanguage(view: EditorView, newLang: string) {
    if (this.codeInfoFrom !== null && this.codeInfoTo !== null) {
      // Replace existing language
      view.dispatch({
        changes: {
          from: this.codeInfoFrom,
          to: this.codeInfoTo,
          insert: newLang,
        },
      });
    } else {
      // Insert new language after opening backticks
      view.dispatch({
        changes: {
          from: this.codeMarkEnd,
          insert: newLang,
        },
      });
    }
  }

  ignoreEvent(event: Event) {
    // Allow select interactions
    return event.type === "mousedown" || event.type === "change";
  }
}

function buildLanguageSelectorDecorations(view: EditorView): Range<Decoration>[] {
  const widgets: Range<Decoration>[] = [];
  const state = view.state;
  const doc = state.doc;
  const addedBlocks = new Set<number>();

  // Use visible ranges or fall back to full document
  const ranges = view.visibleRanges;
  const effectiveRanges =
    ranges.length === 0 || (ranges.length === 1 && ranges[0].from === ranges[0].to)
      ? [{ from: 0, to: doc.length }]
      : ranges;

  for (const { from, to } of effectiveRanges) {
    iterateOverlayNodesInRange(state, from, to, (node) => {
      if (node.name !== "FencedCode") return;

      // Skip if we've already added a widget for this block
      if (addedBlocks.has(node.from)) return;
      addedBlocks.add(node.from);

      // Skip frontmatter blocks
      if (node.getChild("JSONCFrontmatterStart")) return;

      // Get the CodeInfo node (language specifier)
      const codeInfoNode = node.getChild("CodeInfo");
      const codeMarkNode = node.getChild("CodeMark");

      if (!codeMarkNode) return;

      const language = codeInfoNode ? doc.sliceString(codeInfoNode.from, codeInfoNode.to) : "";

      const widget = new LanguageSelectorWidget({
        language,
        codeMarkEnd: codeMarkNode.to,
        codeInfoFrom: codeInfoNode?.from ?? null,
        codeInfoTo: codeInfoNode?.to ?? null,
      });

      widgets.push(
        Decoration.widget({
          widget,
          side: 1,
        }).range(codeMarkNode.to),
      );
    });
  }

  return widgets;
}

export function languageSelectorPlugin() {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = Decoration.set(buildLanguageSelectorDecorations(view), true);
      }

      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.viewportChanged ||
          syntaxTree(update.state) !== syntaxTree(update.startState)
        ) {
          this.decorations = Decoration.set(buildLanguageSelectorDecorations(update.view), true);
        }
      }
    },
    { decorations: (v) => v.decorations },
  );
}
