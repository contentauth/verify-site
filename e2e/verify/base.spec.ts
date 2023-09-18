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

  test('sidebar opens', async ({ page }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await page
      .locator('header')
      .filter({ hasText: 'Verify' })
      .getByLabel('Menu toggle')
      .click();
    await verify.takeSnapshot(`sidebar open`);
  });

  test('specifying an image via source should work', async ({ page }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result for CAICAI.jpg via source`);
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
});
