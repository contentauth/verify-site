const header = [
  ' ADOBE CONFIDENTIAL',
  {
    pattern: 'Copyright \\d{4} Adobe',
    template: ` Copyright ${new Date().getFullYear()} Adobe`,
  },
  ' All Rights Reserved.',
  '',
  ' NOTICE: All information contained herein is, and remains',
  ' the property of Adobe and its suppliers, if any. The intellectual',
  ' and technical concepts contained herein are proprietary to Adobe',
  ' and its suppliers and are protected by all applicable intellectual',
  ' property laws, including trade secret and copyright laws.',
  ' Dissemination of this information or reproduction of this material',
  ' is strictly forbidden unless prior written permission is obtained',
  ' from Adobe.',
];

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:storybook/recommended',
    'plugin:svelte/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      // @TODO: Figure out header enforcement for svelte
      rules: { 'header/header': 'off' },
    },
  ],
  plugins: ['@typescript-eslint', 'header', 'import'],
  ignorePatterns: ['*.cjs'],
  settings: {
    'import/extensions': ['.svelte', '.ts'],
    'import/parsers': {
      'svelte-eslint-parser': ['.svelte'],
    },
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  rules: {
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    'no-multi-spaces': ['error'],
    'header/header': ['error', 'line', header, 2],
    'import/newline-after-import': ['error', { count: 1 }],
    'svelte/html-closing-bracket-spacing': ['error'],
    'svelte/shorthand-attribute': ['error'],
    'svelte/shorthand-directive': ['error'],
    'svelte/no-spaces-around-equal-signs-in-attribute': ['error'],
    'svelte/html-self-closing': ['error'],
    '@typescript-eslint/no-explicit-any': ['error'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-non-null-assertion': ['error'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
