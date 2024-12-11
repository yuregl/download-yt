module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "header-max-length": [2, "always", 50],
        "type-enum": [
            2,
            "always",
            [
                "feat",
                "fix",
                "chore",
                "docs",
                "style",
                "refactor",
                "perf",
                "test",
                "build",
                "ci",
            ],
        ],
        "subject-case": [2, "always", "sentence-case"],
    },
};
