export interface LanguageInfo {
  name: string;
  label: string;
  aliases?: string[];
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { name: "", label: "Plain Text" },
  { name: "javascript", label: "JavaScript", aliases: ["js"] },
  { name: "typescript", label: "TypeScript", aliases: ["ts"] },
  { name: "python", label: "Python", aliases: ["py"] },
  { name: "html", label: "HTML" },
  { name: "css", label: "CSS" },
  { name: "json", label: "JSON" },
  { name: "yaml", label: "YAML", aliases: ["yml"] },
  { name: "markdown", label: "Markdown", aliases: ["md"] },
  { name: "sql", label: "SQL" },
  { name: "bash", label: "Bash", aliases: ["sh", "shell", "zsh"] },
  { name: "ruby", label: "Ruby", aliases: ["rb"] },
  { name: "go", label: "Go", aliases: ["golang"] },
  { name: "rust", label: "Rust", aliases: ["rs"] },
  { name: "java", label: "Java" },
  { name: "c", label: "C" },
  { name: "cpp", label: "C++", aliases: ["c++", "cxx"] },
  { name: "csharp", label: "C#", aliases: ["cs", "c#"] },
  { name: "php", label: "PHP" },
  { name: "swift", label: "Swift" },
  { name: "kotlin", label: "Kotlin", aliases: ["kt"] },
  { name: "scala", label: "Scala" },
  { name: "xml", label: "XML" },
  { name: "toml", label: "TOML" },
  { name: "dockerfile", label: "Dockerfile" },
  { name: "diff", label: "Diff" },
  { name: "liquid", label: "Liquid" },
];

export function findLanguage(name: string): LanguageInfo | undefined {
  const lower = name.toLowerCase();
  return SUPPORTED_LANGUAGES.find(
    (lang) => lang.name === lower || lang.aliases?.includes(lower),
  );
}
