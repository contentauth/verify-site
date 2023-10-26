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

test.describe('Verify - tree view', () => {
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

  test('clicking an ingredient should change the selected asset', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
    await verify.goto(source);
    await page.getByTestId('tree-node-0.1').click({ force: true });
    await verify.takeSnapshot('result for CAICAI.jpg ingredient 0.1', {
      widths: [1280],
    });
  });

  test('panning the tree works as expected', async ({ page }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
    await verify.goto(source);

    const rootNode = page.getByTestId('tree-node-0');

    await rootNode.dragTo(rootNode, {
      force: true,
      targetPosition: {
        x: 300,
        y: 300,
      },
    });

    await verify.takeSnapshot('result for tree pan', {
      widths: [1280],
    });
  });

  test.only('tree zoom works as expected', async ({ page }) => {
    const verify = new VerifyPage(page);
    await page.setViewportSize({ width: 1024, height: 1024 });
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
    await verify.goto(source);

    await page.getByTestId('tree-zoom-out').click();

    await verify.takeSnapshot('result for tree zoom out', {
      widths: [1024],
    });

    await page.getByTestId('tree-zoom-in').click();

    await verify.takeSnapshot('result for tree zoom in', {
      widths: [1024],
    });
  });
});
