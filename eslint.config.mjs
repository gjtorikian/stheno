import typescriptEslint from "@typescript-eslint/eslint-plugin";
import perfectionistNatural from 'eslint-plugin-perfectionist/configs/recommended-natural'
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        perfectionistNatural,
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
    },

    rules: {
        "@typescript-eslint/ban-ts-comment": ["error", {
            minimumDescriptionLength: 10,
            "ts-check": true,
            "ts-expect-error": "allow-with-description",
            "ts-ignore": "allow-with-description",
            "ts-nocheck": "allow-with-description",
        }],

        "no-shadow": "error",
        "prettier/prettier": "error",
    },
}];
