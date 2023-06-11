import { LanguageSupport } from "@codemirror/language"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { json } from "@codemirror/lang-json"
import { Compartment } from "@codemirror/state"

export function getMarkdownConfig(): LanguageSupport {
  return markdown({ codeLanguages: languages, base: markdownLanguage })
}

export function getJsonConfig(): LanguageSupport {
  return json()
}

export const LANGUAGE = new Compartment;
