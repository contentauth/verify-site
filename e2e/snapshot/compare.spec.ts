// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { expect, test } from '@playwright/test';
import { VerifyPage } from '../page';

test.skip('Clicking on the compare button should take you to compare mode', async ({
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

test.skip('Clicking on an ingredient should compare that with the currently selected asset in side by side mode', async ({
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

test.skip('Switching to slider mode should work', async ({ page }) => {
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

test.skip('Dragging the slider handle should move the slider position', async ({
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

test.skip('Clicking the back button in the Compare view header should exit out of compare view mode', async ({
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
