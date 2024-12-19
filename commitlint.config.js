const Configuration = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            ["feat", "fix", "docs", "style", "refactor", "test", "chore"],
        ],
        "header-max-length": [2, "always", 50],
    },
};

export default Configuration;
