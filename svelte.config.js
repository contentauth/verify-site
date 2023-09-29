// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

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
      pollInterval: 60 * 60,
    },
  },
};

export default config;
