module.exports = {
  extends: [require.resolve("./dist/eslint.js")],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto", // 不让prettier检测文件每行结束的格式
      },
    ],
  },
  overrides: [
    {
      files: ["*.js"],
      parser: "@babel/eslint-parser",
      // plugins: ["@typescript-eslint"],
      extends: ["plugin:react/recommended"],
      rules: {
        "@typescript-eslint/no-var-requires": 0,
      },
    },
  ],
};
