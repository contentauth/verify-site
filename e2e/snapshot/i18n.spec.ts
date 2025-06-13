// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { test } from '@playwright/test';
import { VerifyPage } from '../page';

test.describe('Verify - i18n', () => {
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
