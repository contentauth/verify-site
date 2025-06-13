// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { test } from '@playwright/test';
import { VerifyPage } from '../page';

test.describe('Verify - lightbox ', () => {
  test('lightbox launches correctly', async ({ page }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');

    await verify.goto(source);

    await page.getByTestId('lightbox-button').click();

    await verify.takeSnapshot('lightbox');
  });
});
