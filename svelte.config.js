// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import childProcess from 'child_process';

const BASE_PATH = process.env.BASE_PATH || '';

if (BASE_PATH) {
  console.log(`Svelte config using base path: ${BASE_PATH}`);
}

const gitRevision = childProcess
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    enableSourcemap: true,
  },
  preprocess: vitePreprocess({}),

  kit: {
    adapter: adapter({
      pages: 'dist',
      assets: 'dist',
      fallback: 'index.html',
      precompress: false,
      strict: true,
    }),
    alias: {
      $assets: 'assets',
      $src: 'src',
    },
    paths: {
      base: BASE_PATH,
      relative: true,
    },
    version: {
      name: gitRevision,
      pollInterval: 60 * 1000,
    },
  },
};

export default config;
