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

import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';
import path from 'path';
import { replaceCodePlugin } from 'vite-plugin-replace';
import svelteSvg from './etc/rollup/plugins/svelte-svg';

function getSupportedLocales() {
  const dictPath = path.resolve(__dirname, './locales/');

  return fs.readdirSync(dictPath).map((file) => path.basename(file, '.json'));
}

/** @type {import('vite').UserConfig} */
const config = {
  server: {
    fs: {
      allow: ['assets', 'locales'],
    },
  },
  build: {
    minify: 'terser',
    terserOptions: {
      // Added since error names were being mangled, resulting in incorrect error handling (CAI-3792)
      keep_classnames: true,
      // image-blob-reduce breaks unless this is disabled
      compress: { evaluate: false },
    },
  },
  plugins: [
    sveltekit(),
    svelteSvg(),
    replaceCodePlugin({
      replacements: [
        {
          from: '__SUPPORTED_LOCALES__', // type defined in global.d.ts
          to: JSON.stringify(getSupportedLocales()),
        },
        {
          from: '__OVERRIDE_MANIFEST_RECOVERY_BASE_URL__', // type defined in global.d.ts
          to: JSON.stringify(
            process.env.OVERRIDE_MANIFEST_RECOVERY_BASE_URL ?? '',
          ),
        },
        {
          from: '__THUMBNAIL_DATA_TYPE__', // type defined in global.d.ts
          to: JSON.stringify(process.env.THUMBNAIL_DATA_TYPE ?? 'blob'),
        },
      ],
    }),
  ],
  test: {
    include: ['src/**/*.spec.ts'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    setupFilesAfterEnv: ['./src/test/setupAfterEnv.ts'],
  },
};

export default config;
