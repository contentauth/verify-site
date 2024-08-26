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

import { expect, test } from '@playwright/test';
import { VerifyPage } from '../page';

test('Clicking on the compare button should take you to compare mode', async ({
  page,
}) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
  await verify.goto(source);
  await page.getByText('Compare').click();
  await page.getByText('Compare view').waitFor();
  await verify.takeSnapshot(`result for clicking the compare button`, {
    widths: [1280],
  });
});

test('Clicking on an ingredient should compare that with the currently selected asset in side by side mode', async ({
  page,
}) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
  await verify.goto(source);
  await page.getByText('Compare').click();
  await page.getByText('Compare view').waitFor();
  await page
    .getByRole('button', { name: 'CAI.jpg Unrecognized', exact: true })
    .click();
  await page.getByLabel('CAICAI.jpg and CAI.jpg are being compared').waitFor();
  await verify.takeSnapshot(
    `result for comparing an ingredient with the root element`,
    {
      widths: [1280],
    },
  );
});

test('Switching to slider mode should work', async ({ page }) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
  await verify.goto(source);
  await page.getByText('Compare').click();
  await page.getByText('Compare view').waitFor();
  await page
    .locator('select', { hasText: 'Side by Side' })
    .selectOption('Slider');
  await verify.takeSnapshot(`result for switching to slider mode`, {
    widths: [1280],
  });
});

test('Dragging the slider handle should move the slider position', async ({
  page,
}) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
  await verify.goto(source);
  await page.getByText('Compare').click();
  await page.getByText('Compare view').waitFor();
  await page
    .locator('select', { hasText: 'Side by Side' })
    .selectOption('Slider');
  const sliderHandle = await page.getByTestId('slider-handle');
  await sliderHandle.hover({ force: true, position: { x: 5, y: 10 } });
  await page.mouse.down();
  await sliderHandle.hover({ force: true, position: { x: 500, y: 10 } });
  await page.mouse.up();
  await verify.takeSnapshot(`result for dragging the slider handle`, {
    widths: [1280],
  });
});

test('Clicking the back button in the Compare view header should exit out of compare view mode', async ({
  page,
}) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
  await verify.goto(source);
  await page.getByText('Compare').click();
  await page.getByText('Compare view').waitFor();
  await page.getByTestId('compare-back-button').click({ force: true });
  await verify.takeSnapshot(
    `result for clicking the back button in compare mode`,
    {
      widths: [1280],
    },
  );
});

test('Compare view button should be disabled if there is only one item in the tree', async ({
  page,
}) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('A.jpg', 'file');
  await verify.goto(source);
  const compareButton = await page.getByText('Compare');
  await expect(compareButton).toBeDisabled();
  await verify.takeSnapshot(
    `result for disabled compare button if there is only one item in the tree`,
    {
      widths: [1280],
    },
  );
});

test("Compare view button should be disabled if the asset doesn't have a thumbnail", async ({
  page,
}) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('no-thumbnail.jpg', 'file');
  await verify.goto(source);
  const compareButton = await page.getByText('Compare');
  await expect(compareButton).toBeDisabled();
  await verify.takeSnapshot(
    `result for disabled compare button when loading an image with no thumbnail `,
    {
      widths: [1280],
    },
  );
});

test('Compare view should be inaccessible on the mobile breakpoint', async ({
  page,
}) => {
  const verify = new VerifyPage(page);
  await page.setViewportSize({ width: 375, height: 667 });
  const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
  await verify.goto(source);
  await page.getByTestId('asset-info-btn').click({ force: true });
  await page.getByTestId('tree-node-0.0');
  await verify.takeSnapshot(
    `result for the compare view being inaccessible in mobile`,
    {
      widths: [375],
    },
  );
});
