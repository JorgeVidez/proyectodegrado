import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "airbnb-base",
        "airbnb-typescript/base",
        "plugin:prettier/recommended"),
        {
          parserOptions: {
              project: "./tsconfig.json", // Asegúrate de que la ruta a tsconfig.json sea correcta
          },
        },
];

export default eslintConfig;
