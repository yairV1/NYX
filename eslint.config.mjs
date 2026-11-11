import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "test-results/**", // Generated browser traces, including copied vendor scripts.
    "playwright-report/**",
    "next-env.d.ts",
    "public/draco/**", // Vendored decoder from Three.js; lint application sources.
  ]),
]);

export default eslintConfig;
