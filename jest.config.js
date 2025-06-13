// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/unit/'],
  transformIgnorePatterns: [`node_modules/(?!c2pa)`],
  globals: {
    'ts-jest': {
      tsconfig: 'tests/tsconfig.json',
    },
  },
};
