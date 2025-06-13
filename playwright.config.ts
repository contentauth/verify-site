// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { PlaywrightTestConfig } from '@playwright/test';
import testImageConfig from './e2e/c2pa-test-image-service.config';

export const port = parseInt(
  (process.env.HOST_PORT as string | undefined) ?? '4173',
  10,
);
export const fixturesPort = parseInt(
  (process.env.FIXTURES_PORT as string | undefined) ?? '8081',
  10,
);
const base = process.env.BASE_URL;
const baseURL = `${base ?? `http://localhost`}:${port}/`;

const config: PlaywrightTestConfig = {
  testDir: 'e2e',
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  use: {
    baseURL,
    headless: true,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    ignoreHTTPSErrors: true,
    trace: process.env.CI ? 'on-first-retry' : 'off',
  },
  webServer: [
    {
      command: `pnpm preview --port=${port}`,
      port,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `pnpm http-server e2e/fixtures --port=${fixturesPort} --cors --gzip`,
      port: fixturesPort,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `pnpm run test-image-service`,
      port: testImageConfig.port,
      reuseExistingServer: !process.env.CI,
    },
  ],
};

export default config;
