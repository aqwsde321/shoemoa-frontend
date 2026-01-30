import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import nextConfig from "eslint-config-next";

export default [
  {
    // Ignore files in .next directory
    ignores: [".next/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // Extend recommended rules from Next.js and TypeScript ESLint
      ...nextConfig.rules, // Using rules from eslint-config-next directly
      ...tsPlugin.configs.recommended.rules,
      // Custom rule to ignore unused variables starting with underscore
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Add any custom rules here
    },
    settings: {
      next: {
        rootDir: "./", // Specify the root directory of your Next.js project
      },
    },
  },
];