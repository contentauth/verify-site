// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { sveltekit } from '@sveltejs/kit/vite';
import fs from 'fs';
import path from 'path';
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
    sourcemap: true,
    terserOptions: {
      // Added since error names were being mangled, resulting in incorrect error handling
      keep_classnames: true,
      // image-blob-reduce breaks unless this is disabled
      compress: { evaluate: false },
    },
  },
  define: {
    __SUPPORTED_LOCALES__: JSON.stringify(getSupportedLocales()),
    __OVERRIDE_MANIFEST_RECOVERY_BASE_URL__: JSON.stringify(
      process.env.OVERRIDE_MANIFEST_RECOVERY_BASE_URL ?? '',
    ),
    __THUMBNAIL_DATA_TYPE__: JSON.stringify(
      process.env.THUMBNAIL_DATA_TYPE ?? 'blob',
    ),
  },
  experimental: {
    // Hack to make sure Svelte(Kit)/Vite doesn't try to automatically prepend the hostname to
    // our asset URLs. This breaks snapshot testing on Percy/Browserstack due to them not being
    // able to proxy localhost in Safari (see https://docs.percy.io/docs/browsers-specific-handling#localhost-proxy-support-on-safari).
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return {
          runtime: `${JSON.stringify(`/${filename}`)}`,
        };
      } else {
        return { relative: true };
      }
    },
  },
  plugins: [sveltekit(), svelteSvg()],
  test: {
    include: ['src/**/*.spec.ts'],
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    setupFilesAfterEnv: ['./src/test/setupAfterEnv.ts'],
  },
};

export default config;
