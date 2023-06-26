import { syntaxTree } from '@codemirror/language'
import type { EditorState, Extension, Range } from '@codemirror/state'
import { RangeSet, StateField } from '@codemirror/state'
import type { DecorationSet } from '@codemirror/view'
import { Decoration, EditorView, WidgetType } from '@codemirror/view'

interface ImageWidgetParams {
  url: string,
}

class ImageWidget extends WidgetType {
  readonly url

  constructor({ url }: ImageWidgetParams) {
    super()

    this.url = url
  }

  eq(imageWidget: ImageWidget) {
    return imageWidget.url === this.url
  }

  toDOM() {
    const container = document.createElement('div')
    const image = container.appendChild(document.createElement('img', {

    }))

    container.setAttribute('aria-hidden', 'true')
    container.className = 'flex justify-center items-center shadow-inner bg-neutral-200 p-4 my-2'
    image.className = 'object-scale-down h-72'
    image.src = this.url

    return container
  }
}

export const images = (): Extension => {
  const imageRegex = /!\[.*?\]\((?<url>.*?\.(png|jpeg|jpg|gif|ico))\)/

  const imageDecoration = (imageWidgetParams: ImageWidgetParams) => Decoration.widget({
    widget: new ImageWidget(imageWidgetParams),
    side: 1,
    block: true,
  })

  const decorate = (state: EditorState) => {
    const widgets: Range<Decoration>[] = []

    syntaxTree(state).iterate({
      enter: ({ type, from, to }) => {
        if (type.name === 'Image') {
          const result = imageRegex.exec(state.doc.sliceString(from, to))
          console.log(result)
          if (result?.groups?.url) {
            widgets.push(
              imageDecoration(
                { url: result.groups.url }
              ).range(
                state.doc.lineAt(to).to
              )
            )
          }
        }
      },
    })

    return widgets.length > 0 ? RangeSet.of(widgets) : Decoration.none
  }

  const imagesField = StateField.define<DecorationSet>({
    create(state) {
      return decorate(state)
    },
    update(images, transaction) {
      if (transaction.docChanged)
        return decorate(transaction.state)

      return images.map(transaction.changes)
    },
    provide(field) {
      return EditorView.decorations.from(field)
    },
  })

  return [
    imagesField,
  ]
}
