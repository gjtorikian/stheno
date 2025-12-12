import type { EditorState, Extension, Range } from "@codemirror/state";
import type { DecorationSet } from "@codemirror/view";

import { syntaxTree } from "@codemirror/language";
import { RangeSet, StateField } from "@codemirror/state";
import { Decoration, EditorView, WidgetType } from "@codemirror/view";

import { createViewportDecorator, iterateOverlayNodesInRange } from "../util";

const IMAGE_REGEX = /!\[.*?\]\((?<url>.*?\.(png|jpeg|jpg|gif|ico))\)/;

interface ImageExtensionParams {
  container: string;
  img: string;
}
interface ImageWidgetParams {
  classes?: ImageExtensionParams;
  url: string;
}

class ImageWidget extends WidgetType {
  readonly classes;
  readonly url;

  constructor({ classes, url }: ImageWidgetParams) {
    super();

    this.url = url;
    this.classes = classes;
  }

  eq(imageWidget: ImageWidget) {
    return imageWidget.url === this.url;
  }

  toDOM() {
    const container = document.createElement("div");
    const image = container.appendChild(document.createElement("img"));

    container.setAttribute("aria-hidden", "true");
    container.className = this.classes?.container || "";
    image.className = this.classes?.img || "";
    image.src = this.url;

    return container;
  }
}

/**
 * Apply styling to image markdown syntax.
 * Mutes ![, ], (, ), and URL while styling alt text as a link.
 */
function imageMarkStylingPlugin() {
  return createViewportDecorator({
    buildDecorations: (state, from, to) => {
      const widgets: Range<Decoration>[] = [];

      iterateOverlayNodesInRange(state, from, to, (node) => {
        if (node.name === "Image") {
          const linkMarks = node.getChildren("LinkMark");
          const urlNode = node.getChild("URL");

          if (linkMarks.length >= 2) {
            // "![" - apply stheno-meta
            widgets.push(
              Decoration.mark({ class: "stheno-meta" }).range(
                linkMarks[0].from,
                linkMarks[0].to,
              ),
            );

            // Alt text between first and second LinkMark - use stheno-link styling
            const altStart = linkMarks[0].to;
            const altEnd = linkMarks[1].from;
            if (altEnd > altStart) {
              widgets.push(
                Decoration.mark({ class: "stheno-link" }).range(altStart, altEnd),
              );
            }

            // Remaining LinkMarks ("]", "(", ")") and URL - apply stheno-meta
            for (let i = 1; i < linkMarks.length; i++) {
              widgets.push(
                Decoration.mark({ class: "stheno-meta" }).range(
                  linkMarks[i].from,
                  linkMarks[i].to,
                ),
              );
            }

            if (urlNode) {
              widgets.push(
                Decoration.mark({ class: "stheno-meta stheno-url" }).range(
                  urlNode.from,
                  urlNode.to,
                ),
              );
            }
          }
        }
      });

      return widgets;
    },
  });
}

/**
 * Creates a StateField for image widget decorations.
 * Block decorations require StateField (not ViewPlugin).
 * Uses resolveInner to find Image nodes in markdown overlays.
 */
function createImageWidgetField(styles: ImageExtensionParams | null) {
  const decorate = (state: EditorState) => {
    const widgets: Range<Decoration>[] = [];
    const tree = syntaxTree(state);
    const doc = state.doc;
    const seen = new Set<string>();

    // Iterate through each line and use resolveInner to find Image nodes in overlays
    for (let i = 1; i <= doc.lines; i++) {
      const line = doc.line(i);

      // Check at various positions in the line for Image nodes
      for (let pos = line.from; pos <= line.to; pos++) {
        let node: ReturnType<typeof tree.resolveInner> | null = tree.resolveInner(pos, 1);

        while (node) {
          if (node.name === "Image") {
            const key = `${node.from}:${node.to}`;
            if (!seen.has(key)) {
              seen.add(key);

              const text = doc.sliceString(node.from, node.to);
              const result = IMAGE_REGEX.exec(text);

              if (result?.groups?.url) {
                const widgetParams: ImageWidgetParams = {
                  url: result.groups.url,
                  ...(styles && { classes: styles }),
                };

                widgets.push(
                  Decoration.widget({
                    block: true,
                    side: 1,
                    widget: new ImageWidget(widgetParams),
                  }).range(doc.lineAt(node.to).to),
                );
              }
            }
            break; // Found Image node, no need to check parent
          }
          node = node.parent;
        }
      }
    }

    return widgets.length > 0 ? RangeSet.of(widgets, true) : Decoration.none;
  };

  return StateField.define<DecorationSet>({
    create(state) {
      return decorate(state);
    },
    provide(field) {
      return EditorView.decorations.from(field);
    },
    update(imageList, transaction) {
      if (transaction.docChanged || syntaxTree(transaction.state) !== syntaxTree(transaction.startState)) {
        return decorate(transaction.state);
      }
      return imageList.map(transaction.changes);
    },
  });
}

export const images = (styles: ImageExtensionParams | null = null): Extension => {
  return [createImageWidgetField(styles), imageMarkStylingPlugin()];
};
