// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

// End-to-end smoke tests for the c2pa-web SDK migration and two-pass trust validation.
//
// Fixture images are served by the local http-server at the fixtures port (default 8081) and
// loaded via the app's ?source= query param.
//
// Tests that require proprietary images not checked into the repo (e.g. a "Legacy trust" image)
// can be run locally by setting TEST_LEGACY_IMAGE_PATH to an absolute file path on disk. Those
// tests are automatically skipped in CI when the variable is not set.

import { test, expect } from '@playwright/test';

import { fixturesPort } from '../playwright.config';

const FIXTURES_BASE = `http://localhost:${fixturesPort}`;

// Collect browser-side errors, ignoring known third-party noise.
function collectPageErrors(page: import('@playwright/test').Page) {
  const consoleErrors: string[] = [];
  const pageErrors: Error[] = [];

  page.on('console', (msg) => {
    if (msg.type() !== 'error') {
      return;
    }

    const text = msg.text();

    if (
      text.includes('Lit is in dev mode') ||
      text.includes('Spectrum Web Components is in dev mode') ||
      text.includes('<Root> was created without expected prop') ||
      text.includes('ERR_BLOCKED_BY_CLIENT')
    ) {
      return;
    }

    consoleErrors.push(text);
  });

  page.on('pageerror', (err) => pageErrors.push(err));

  return { consoleErrors, pageErrors };
}

test.describe('c2pa-web SDK migration — trust badge rendering', () => {
  test('loads a conformant fixture image without browser errors', async ({
    page,
  }) => {
    const { consoleErrors, pageErrors } = collectPageErrors(page);

    await page.goto(
      `/?source=${encodeURIComponent(`${FIXTURES_BASE}/CAICAI.jpg`)}`,
    );

    await expect(
      page.getByText('Content Credentials', { exact: true }),
    ).toBeVisible({
      timeout: 20000,
    });

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });

  test('does not show an unrecognized-issuer banner for a conformant fixture image', async ({
    page,
  }) => {
    const { consoleErrors, pageErrors } = collectPageErrors(page);

    await page.goto(
      `/?source=${encodeURIComponent(`${FIXTURES_BASE}/CAICAI.jpg`)}`,
    );

    await expect(
      page.getByText('Content Credentials', { exact: true }),
    ).toBeVisible({
      timeout: 20000,
    });

    // The orange "issuer couldn't be recognized" banner must not appear for an image signed
    // by a conformant implementation.
    await expect(
      page.getByText("issuer couldn't be recognized", { exact: false }),
    ).toBeHidden();

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });

  // Requires a locally-available legacy-signed image. Set TEST_LEGACY_IMAGE_PATH to an
  // absolute path on disk to run this test; it is skipped when the variable is unset so that
  // CI passes without the proprietary asset.
  test('shows a "Legacy trust" badge for a legacy-signed image', async ({
    page,
  }) => {
    const legacyImagePath = process.env.TEST_LEGACY_IMAGE_PATH;
    test.skip(
      !legacyImagePath,
      'TEST_LEGACY_IMAGE_PATH not set — skipping legacy trust test',
    );

    const { consoleErrors, pageErrors } = collectPageErrors(page);

    await page.goto('/');

    // legacyImagePath is guaranteed non-null here — the test.skip above handles the null case.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await page.setInputFiles('input[type="file"]', legacyImagePath!);

    await expect(
      page.getByText('Content Credentials', { exact: true }),
    ).toBeVisible({
      timeout: 20000,
    });

    await expect(page.getByText('Legacy trust', { exact: true })).toBeVisible({
      timeout: 10000,
    });

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });
});
