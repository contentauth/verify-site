// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Handle } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';

export const handle = (async ({ event, resolve }) => {
  const siteConfig =
    process.env.SITE_CONFIG ||
    (await readFile('etc/site-config.json', { encoding: 'utf-8' }));
  const siteConfigScript = `
    <script type="text/javascript">
      window.siteConfig = ${siteConfig.trim()};
    </script>
  `;

  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace('%siteConfig%', siteConfigScript),
  });

  return response;
}) satisfies Handle;
