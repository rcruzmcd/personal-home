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
    "next-env.d.ts",
    // CLI-generated runtime artifacts from `supabase start` / `db reset`,
    // not source — already excluded from git via supabase/.gitignore.
    "supabase/.temp/**",
    "supabase/.branches/**",
  ]),
]);

export default eslintConfig;
