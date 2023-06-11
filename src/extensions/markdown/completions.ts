import { Completion, CompletionContext, snippet } from "@codemirror/autocomplete"

const options: Completion[] = [
  {
    label: "/image",
    type: "text",
    apply: snippet("![${1:alt_text}](${2:url})"),
    detail: "An inline image"
  },
  {
    label: "/link",
    type: "text",
    apply: snippet("[${1:link_text}](${2:url})"),
    detail: "A link to some other place"
  },
  {
    label: "/codeBlock",
    type: "text",
    apply: snippet("```${1:language}\n${2:code}\n```"),
    detail: "A block of code or other preformatted text"
  }
]

export function markdownCompletions(context: CompletionContext) {
  let word = context.matchBefore(/\/\w*/)

  if (!word) return

  if (word.from == word.to && !context.explicit)
    return null

  return {
    from: word.from,
    options,
  }
}
