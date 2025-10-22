import tseslint from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["node_modules/**", "lib/**", "android/**", "ios/**", "*.podspec"]
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];
