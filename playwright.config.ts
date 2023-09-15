// ADOBE CONFIDENTIAL
// Copyright 2021 Adobe
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

import type { PlaywrightTestConfig } from '@playwright/test';
import testImageConfig from './e2e/c2pa-test-image-service.config';

export const port = 4173;
export const fixturesPort = 8080;
const base = process.env.BASE_URL;
const baseURL = `${base ?? `http://localhost`}:${port}/`;

const config: PlaywrightTestConfig = {
  testDir: 'e2e',
  retries: 1,
  use: {
    baseURL,
    headless: true,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'pnpm preview',
      port: port,
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
