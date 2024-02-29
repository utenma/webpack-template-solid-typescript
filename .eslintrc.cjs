/* eslint-disable no-undef */
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
  ignorePatterns: ['dist', 'node_modules'],
  settings: {},
  rules: {
    "@typescript-eslint/consistent-type-imports": "warn"
  }
}
