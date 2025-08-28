// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { test } from '@playwright/test';
import { VerifyPage } from '../page';

test.describe('Verify - tree view', () => {
  test('missing thumbnails should display correctly', async ({ page }) => {
    const verify = new VerifyPage(page);
    await page.setViewportSize({ width: 2000, height: 1024 });
    const source = VerifyPage.getFixtureUrl('missingThumbnails');
    await verify.goto(source);
    await page.getByTestId('tree-fit').click();
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

  test('panning small trees (width/height smaller than the screen) works as expected', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('A.jpg', 'file');
    await verify.goto(source);

    const rootNode = page.getByTestId('tree-node-0');

    await rootNode.dragTo(rootNode, {
      force: true,
      targetPosition: {
        x: 300,
        y: 300,
      },
    });

    await verify.takeSnapshot('result for small tree pan', {
      widths: [1280],
    });
  });

  test('tree zoom works as expected', async ({ page }) => {
    const verify = new VerifyPage(page);
    await page.setViewportSize({ width: 1024, height: 1024 });
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
    await verify.goto(source);
    await page.getByTestId('tree-zoom-in').click();

    await verify.takeSnapshot('result for tree zoom in at scale 1', {
      widths: [1024],
    });

    await page.getByTestId('tree-zoom-out').click();

    //TODO : improve wait for scale 0.5 to appear
    await page.waitForTimeout(1000);

    await verify.takeSnapshot('result for tree zoom out at scale 0.5', {
      widths: [1024],
    });

    await page.getByTestId('tree-zoom-out').click();

    //TODO : improve wait for scale 0.25 to appear
    await page.waitForTimeout(1000);

    await verify.takeSnapshot('result for tree zoom out at scale 0.25', {
      widths: [1024],
    });

    await page.getByTestId('tree-zoom-out').click();

    //TODO : improve wait for scale 0.125 to appear
    await page.waitForTimeout(1000);

    await verify.takeSnapshot('result for tree zoom out at scale 0.125', {
      widths: [1024],
    });

    await page.getByTestId('tree-zoom-in').click();

    //TODO : improve wait for scale 0.25 to appear
    await page.waitForTimeout(1000);

    await verify.takeSnapshot('result for tree zoom in at scale 0.25', {
      widths: [1024],
    });

    await page.getByTestId('tree-zoom-in').click();

    //TODO : improve wait for scale 0.5 to appear
    await page.waitForTimeout(1000);

    await verify.takeSnapshot('result for tree zoom in at scale 0.5', {
      widths: [1024],
    });
  });

  test('fitting regular-sized tree to the window works as expected (scale>=0.125)', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await page.setViewportSize({ width: 1024, height: 1024 });
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
    await verify.goto(source);

    await page.getByTestId('tree-fit').click();

    await verify.takeSnapshot(
      'result for fitting regular-sized tree to the window (scale>=0.125)',
      {
        widths: [1024],
      },
    );
  });

  test('fitting large tree to the window works as expected (scale<0.125)', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await page.setViewportSize({ width: 1024, height: 1024 });
    const source = VerifyPage.getFixtureUrl('obi.jpg', 'file');
    await verify.goto(source);

    await page.getByTestId('tree-fit').click();

    await verify.takeSnapshot(
      'result for fitting large tree to the window (scale<0.125)',
      {
        widths: [1024],
      },
    );

    await page.getByTestId('tree-zoom-in').click();

    await verify.takeSnapshot(
      'result zooming in after fitting a large tree (scale=0.125)',
      {
        widths: [1024],
      },
    );
  });
});

test('tree zoom with the mouse wheel works as expected', async ({ page }) => {
  const verify = new VerifyPage(page);
  await page.setViewportSize({ width: 1024, height: 1024 });
  const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
  await verify.goto(source);

  await page.mouse.move(500, 500);

  await page.mouse.wheel(0, -300);

  await verify.takeSnapshot(
    'result for zooming into the tree with the mouse wheel',
    {
      widths: [1024],
    },
  );

  await page.mouse.wheel(0, 800);

  await verify.takeSnapshot(
    'result for zooming out of the tree with the mouse wheel',
    {
      widths: [1024],
    },
  );
});

test('Incomplete content credentials should display an incomplete CR icon on the tree node', async ({
  page,
}) => {
  const verify = new VerifyPage(page);
  await page.setViewportSize({ width: 1024, height: 1024 });
  const source = VerifyPage.getFixtureUrl('XCA.jpg', 'file');
  await verify.goto(source);
  await verify.takeSnapshot(
    'result for tree view with incomplete content credentials',
    {
      widths: [1024],
    },
  );
});

test('Invalid content credentials should display an invalid CR icon on the tree node', async ({
  page,
}) => {
  const verify = new VerifyPage(page);
  await page.setViewportSize({ width: 1024, height: 1024 });
  const source = VerifyPage.getFixtureUrl('E-sig-CA.jpg', 'file');
  await verify.goto(source);
  await verify.takeSnapshot(
    'result for tree view with invalid content credentials',
    {
      widths: [1024],
    },
  );
});
