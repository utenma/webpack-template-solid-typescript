// @ts-check

/** @returns { import('eslint').Linter.Config } */
module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  parser: '@typescript-eslint/parser',
  plugins: ['solid'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:solid/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  settings: {},
  rules: {}
}
