import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      ".output/**",
      ".nitro/**",
      ".pnpm-store/**",
      "storage/**",
      "public/**",
      "src/routeTree.gen.ts",
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  prettier,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_|error",
          varsIgnorePattern: "^_|error",
        },
      ],
      // intentional in debounced effects and test cleanup
      "no-empty": ["error", { allowEmptyCatch: true }],
      // react compiler rules, new in eslint-plugin-react-hooks 7. they flag real
      // issues in older components, but fixing them means reworking those
      // components, so they stay warnings until someone does that
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  }
);
