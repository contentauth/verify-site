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

import { test } from '@playwright/test';
import { VerifyPage } from './page';

test.describe('Verify - base functionality', () => {
  test('zero state loads', async ({ page }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.takeSnapshot(`zero state`);
  });

  test('specifying an image via source should work (CAICAI.jpg)', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result for CAICAI.jpg via source`);
  });

  test('specifying an image via source should work (fake-news.jpg)', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('fake-news.jpg', 'file');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result for fake-news.jpg via source`);
  });

  test('specifying an image via source should work (moonrise.jpg)', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('moonrise.jpg', 'file');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result for moonrise.jpg via source`);
  });

  test('specifying a different language via dropdown should work', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
    await verify.goto(source);
    await verify.languagePicker.click();
    verify.languagePicker.selectOption('Français');

    await verify.takeTallSnapshot(
      `result setting language as fr-FR via dropdown`,
    );
  });

  test('specifying a different language via URL parameter should work', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
    await verify.goto(source, { lang: 'ja-JP' });

    await verify.takeTallSnapshot(
      `result setting language as ja-JP via URL parameter`,
    );
  });

  test('missing thumbnails should display correctly', async ({ page }) => {
    const verify = new VerifyPage(page);
    await page.setViewportSize({ width: 2000, height: 1024 });
    const source = VerifyPage.getFixtureUrl('missingThumbnails');
    await verify.goto(source);
    await page.getByTestId('tree-node-0.0').click({ force: true });
    await page
      .locator('div[role="img"]', { hasText: 'No thumbnail available' })
      .waitFor();
    await verify.takeSnapshot(`result for missing thumbnails`, {
      widths: [2000],
      minHeight: 1024,
    });
  });

  test('source thumbnail should show if image does not have a thumbnail and hashes are valid', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('no-thumbnail.jpg', 'file');
    await verify.goto(source);
    await verify.takeTallSnapshot(
      `result showing valid claim without thumbnail`,
    );
  });
});
