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

import { rest } from 'msw';
import { endpoints } from '../handlers';
import { VerifyPage } from '../page';
import { test } from '../test';

test.describe('Verify - manifest recovery', () => {
  test('returns results that can be selected and cleared', async ({ page }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');

    await verify.goto(source);

    await page.getByText('Search for possible matches').click();

    await page
      .getByTestId('manifest-recovery-results')
      .getByRole('button')
      .first()
      .click();

    await page.waitForTimeout(500);

    await verify.takeSnapshot('result for manifest recovery', {
      widths: [1024],
    });

    await page.getByTestId('manifest-recovery-clear').click();

    await page.waitForTimeout(500);

    await verify.takeSnapshot('result for clearing manifest recovery', {
      widths: [1024],
    });
  });

  test('handles errors', async ({ page, worker }) => {
    await worker.use(
      rest.get(endpoints['manifest-recovery'], (_, response, context) =>
        response(context.status(500)),
      ),
    );

    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');

    await verify.goto(source);

    await page.getByText('Search for possible matches').click();

    await page.getByTestId('toast-0').waitFor();

    await page.waitForTimeout(500);

    await verify.takeSnapshot('result for manifest recovery error');
  });

  test('mobile - returns results that can be selected and cleared', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 1024 });

    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');

    await verify.goto(source);

    await page.getByText('Search for possible matches').click();

    const recoveryItem = page
      .getByTestId('manifest-recovery-results')
      .getByRole('button')
      .first();

    await recoveryItem.waitFor();

    await verify.takeSnapshot('result for manifest recovery - mobile', {
      widths: [375],
    });

    await recoveryItem.click();

    await verify.takeSnapshot(
      'result for selecting manifest recovery item - mobile',
      {
        widths: [375],
      },
    );

    await page.getByText('Content Credentials', { exact: true }).click();
    await page.waitForTimeout(500);

    await page.getByTestId('manifest-recovery-clear').click();

    await verify.takeSnapshot(
      'result for clearing manifest recovery - mobile',
      { widths: [375] },
    );
  });
});
