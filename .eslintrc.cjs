module.exports = {
  extends: "@altarhost/eslint-config/profiles/react",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname
  }
}
