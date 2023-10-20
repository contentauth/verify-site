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
import { VerifyPage } from '../page';

test.describe('Verify - assertion display', () => {
  test('exif data should be displayed correctly', async ({ page }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('exif');
    await verify.goto(source);
    const altText = 'Map showing approximate location';
    await page.getByAltText(altText).waitFor();
    await verify.takeTallSnapshot(`result for generated exif image`);
  });

  test('ai model usage (do not train) should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('dnt');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result for ai model usage image`);
  });

  test('image with inference metadata should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('inference');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result for image with inference metadata`);
  });

  test('image without inference metadata should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('no-inference');
    await verify.goto(source);
    await verify.takeTallSnapshot(
      `result for image without inference metadata`,
    );
  });
});
