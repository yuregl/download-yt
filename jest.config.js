export default {
    preset: "ts-jest",
    testEnvironment: "node",
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    forceCoverageMatch: ["**/*.t.js"],
    collectCoverageFrom: [
        "**/*.{ts,tsx}",
        "!**/node_modules/**",
        "!src/**/*.spec.ts",
        "!src/**/index.ts",
        "!src/@types/**",
        "!src/config/**",
        "!**/*interface*",
        "!**/*dto*",
    ],
    coverageProvider: "v8",
    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: -10,
        },
    },
};
