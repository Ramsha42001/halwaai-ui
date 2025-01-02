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
    },
  },
];

export default eslintConfig;
