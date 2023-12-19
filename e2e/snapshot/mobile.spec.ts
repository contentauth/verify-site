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

test.describe('Verify - mobile view', () => {
  test('mobile navigation works as expected', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1024 });
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
    await verify.goto(source);
    await verify.treeViewVisible();
    await page.getByTestId('tree-fit').click();
    await page.setViewportSize({ width: 375, height: 1024 });

    await verify.takeSnapshot(`mobile - left column`, { widths: [375] });

    await page.getByRole('button', { name: 'CAICAI.jpg' }).click();

    await verify.takeSnapshot(`mobile - tree view`, { widths: [375] });

    await page.getByTestId('tree-node-0.0').click({ force: true });

    await verify.takeSnapshot(`mobile - right column`, { widths: [375] });
  });
});
