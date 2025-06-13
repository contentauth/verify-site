// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import tailwindNesting from 'tailwindcss/nesting/index.js';

const production = process.env.NODE_ENV === 'production';

export default {
  plugins: [
    postcssImport,
    tailwindNesting,
    tailwindcss,
    autoprefixer,
    ...(production ? [cssnano({ preset: 'default' })] : []),
  ],
};
