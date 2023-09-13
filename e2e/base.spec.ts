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

import percySnapshot from '@percy/playwright';
import { expect, test } from '@playwright/test';

test.describe('Base functionality', () => {
  test('Homepage site loads', async ({ page }) => {
    await page.goto('/c');
    // await page.locator('header').filter({ hasText: 'Content Credentials' }).waitFor();
    await expect(page).toHaveTitle(/Content Credentials/);
    await percySnapshot(page, 'Homepage zero state');
  });
});
