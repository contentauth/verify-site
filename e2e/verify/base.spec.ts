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

  test('specifying an image via source should work', async ({ page }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg');
    await verify.goto(source);
    await verify.takeSnapshot(`result for CAICAI.jpg via source`);
  });
});
