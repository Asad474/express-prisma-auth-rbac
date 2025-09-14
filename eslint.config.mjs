// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: ["**/*.js"],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // ✅ Allow unused function arguments (req, res, next) everywhere
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "none", // <-- ignores unused function params
          vars: "all",
          caughtErrors: "none",
        },
      ],

      // ✅ Allow empty functions (useful for controller stubs)
      "@typescript-eslint/no-empty-function": "off",
    },
  },
  perfectionist.configs["recommended-natural"]
);
