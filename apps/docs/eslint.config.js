import nextConfig from "@aglaya/eslint-config/next";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextConfig,
  {
    ignores: ["eslint.config.js"]
  },
  {
    rules: {
      // Disable indent rule to prevent stack overflow
      "indent": "off",
      "@typescript-eslint/indent": "off"
    }
  }
];
