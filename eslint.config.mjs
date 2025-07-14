import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    ignorePatterns: ["**/node_modules/**", "**/.next/**", "storage/**"],
    rules: {
      "react-refresh/only-export-components": "off", // Disabled the rule
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_|error",
          varsIgnorePattern: "^_|error",
        },
      ],
      "jsx-a11y/no-access-key": "off",
    },
  }),
];

export default eslintConfig;
