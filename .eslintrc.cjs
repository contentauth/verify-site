const header = [
  {
    pattern:
      ' Copyright 2021-2024 Adobe, Copyright \\d{4} The C2PA Contributors',
    template: ` Copyright 2021-2024 Adobe, Copyright ${new Date().getFullYear()} The C2PA Contributors`,
  },
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
