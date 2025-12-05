import type { EditorState, Extension, Range } from "@codemirror/state";
import type { DecorationSet } from "@codemirror/view";

import { syntaxTree } from "@codemirror/language";
import { RangeSet, StateField } from "@codemirror/state";
import { Decoration, EditorView, WidgetType } from "@codemirror/view";

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

export const images = (styles: ImageExtensionParams | null = null): Extension => {
  const imageDecoration = (imageWidgetParams: ImageWidgetParams) =>
    Decoration.widget({
      block: true,
      side: 1,
      widget: new ImageWidget(imageWidgetParams),
    });

  const decorate = (state: EditorState) => {
    const widgets: Range<Decoration>[] = [];

    syntaxTree(state).iterate({
      enter: ({ from, to, type }) => {
        if (type.name === "Image") {
          const result = IMAGE_REGEX.exec(state.doc.sliceString(from, to));

          if (result?.groups?.url) {
            const widgetParams: ImageWidgetParams = {
              url: result.groups.url,
              ...(styles && { classes: styles }),
            };

            widgets.push(imageDecoration(widgetParams).range(state.doc.lineAt(to).to));
          }
        }
      },
    });

    return widgets.length > 0 ? RangeSet.of(widgets) : Decoration.none;
  };

  const imagesField = StateField.define<DecorationSet>({
    create(state) {
      return decorate(state);
    },
    provide(field) {
      return EditorView.decorations.from(field);
    },
    update(imageList, transaction) {
      if (transaction.docChanged) return decorate(transaction.state);

      return imageList.map(transaction.changes);
    },
  });

  return [imagesField];
};
