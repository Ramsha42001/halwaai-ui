import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Disable unused variables rule
      "react/no-unescaped-entities": "off",       // Disable unescaped entities warning
      "@next/next/no-img-element": "off",         // Allow usage of <img> instead of <Image>
      "@typescript-eslint/no-explicit-any": "off", // Disable explicit any rule
      "@typescript-eslint/no-non-null-assertion": "off", // Disable non-null assertion rule
      "@typescript-eslint/ban-ts-comment": "off", // Allow @ts-ignore and @ts-nocheck
      "@typescript-eslint/no-empty-function": "off", // Allow empty functions
      "@typescript-eslint/no-var-requires": "off", // Allow require statements
      "react-hooks/exhaustive-deps": "off", // Disable exhaustive deps warning
      "no-console": "off", // Allow console statements
      "prefer-const": "off", // Disable prefer const rule
    },
  },
];

export default eslintConfig;
