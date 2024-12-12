import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,ts}"] },
    { languageOptions: { globals: globals.node } },
    {
        rules: {
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/explicit-function-return-type": [
                "error",
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true,
                    allowHigherOrderFunctions: true,
                },
            ],
            "@typescript-eslint/explicit-module-boundary-types": "error",
            "@typescript-eslint/no-empty-function": [
                "error",
                {
                    allow: ["arrowFunctions"],
                },
            ],
            "@typescript-eslint/consistent-type-assertions": "error",
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
];
