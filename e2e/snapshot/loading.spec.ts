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

test.describe('Verify - loading states', () => {
  test('zero state loads', async ({ page }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.takeSnapshot(`zero state`);
  });

  test('specifying an image via source should work (CAICAI.jpg)', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('CAICAI.jpg', 'file');
    await verify.goto(source);
    await verify.waitForActions();
    await verify.treeViewVisible();
    await verify.takeTallSnapshot(`result for CAICAI.jpg via source`);
  });

  test('specifying an image without content credentials via source should work (A.jpg)', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('A.jpg', 'file');
    await verify.goto(source);
    await verify.takeSnapshot(`result for A.jpg via source`);
  });

  test('specifying an image via source should work (fake-news.jpg)', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('fake-news.jpg', 'file');
    await verify.goto(source);
    await verify.waitForActions();
    await verify.takeTallSnapshot(`result for fake-news.jpg via source`, {
      widths: [1280],
    });
  });

  // @TODO: broken? drag-drop not recognizing drop item as a valid file
  test.skip('specifying an image via drag and drop should work (CAICAI.jpg)', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.dropFile('CAICAI.jpg');
    await verify.treeViewVisible();
    await verify.takeSnapshot(`result for CAICAI.jpg via drag and drop`, {
      widths: [1280],
    });
  });

  test('loading an image via the file picker should work (CAICAI.jpg)', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.chooseFile('CAICAI.jpg');

    await verify.takeSnapshot(`result for CAICAI.jpg via file picker`, {
      widths: [1280],
    });
  });

  test('loading an image via the left-column file picker should work (CAICAI.jpg)', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.chooseFile('no-thumbnail.jpg');
    await verify.treeViewVisible();
    await verify.chooseFile('CAICAI.jpg', {
      locator: page.getByText('Select another file from your device'),
    });
    await verify.treeViewVisible();

    await verify.takeSnapshot(
      `result for CAICAI.jpg via left-column file picker`,
      { widths: [1280] },
    );
  });

  test('loading an image with no credentials should work', async ({ page }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.chooseFile('A.jpg');

    await verify.takeSnapshot(`result for A.jpg`, {
      widths: [1280],
    });
  });

  test('loading an image with beta credentials should show the beta modal', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.chooseFile('beta.jpg', { waitForTree: false });

    await page.getByText('Use an older version of Verify?').waitFor();

    await verify.takeSnapshot('result for beta image');
  });

  test('loading an image with an OTGP head claim should work', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.chooseFile('XCA.jpg');

    await verify.takeSnapshot(`result for XCA.jpg`);
  });

  test('loading an image with an invalid head claim should work', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.chooseFile('E-uri-CIE-sig-CA.jpg');

    await verify.takeSnapshot(`result for E-uri-CIE-sig-CA.jpg`);
  });

  test('loading an image with an invalid ingredient should work', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.chooseFile('CIE-sig-CA.jpg');

    await verify.takeSnapshot(`result for CIE-sig-CA.jpg`);
  });

  test('loading an image with multiple different signature types should work', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.chooseFile('different-sig-types.jpg');

    await verify.takeSnapshot(`result for different-sig-types.jpg`);
  });

  test('source thumbnail should show if image does not have a thumbnail and hashes are valid', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('no-thumbnail.jpg', 'file');
    await verify.goto(source);
    await verify.takeTallSnapshot(
      `result showing valid claim without thumbnail`,
    );
  });

  test('loading an image from Firefly should not show an untrusted signing banner', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.chooseFile('firefly-labradoodle.jpg');

    await verify.takeSnapshot(
      `result showing Firefly image without untrusted banner`,
    );
  });

  test('loading an image with an allowed end-entity cert not show an untrusted signing banner', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await verify.goto();
    await verify.chooseFile('endentity-dog.jpg');

    await verify.takeSnapshot(
      `result showing image with allowed end-entity cert without untrusted banner`,
    );
  });

  test('loading an image with a nested untrusted ingredient should show a warning L1', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('LR_PS_expc_CAI.jpg', 'file');
    await verify.goto(source);

    await verify.takeSnapshot(
      `result showing image with unselected nested untrusted ingredient`,
    );
  });

  test('clicking a nested untrusted ingredient should show the unknown source warning', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('LR_PS_expc_CAI.jpg', 'file');
    await verify.goto(source);

    await page.getByTestId('tree-zoom-out').click();

    //TODO : improve wait for scale 0.5 to appear
    await page.waitForTimeout(1000);

    await page.getByTestId('tree-node-0.0.0').click({ force: true });
    await verify.takeSnapshot(
      'result showing image with selected nested untrusted ingredient',
      {
        widths: [1280],
        minHeight: 1200,
      },
    );
  });

  test('a nested dataHash.mismatch validation error should show up as invalid', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl(
      'acr-nested-validation-result.jpg',
      'file',
    );
    await verify.goto(source);

    await verify.takeSnapshot(
      `result showing image with nested dataHash.mismatch validation error`,
    );
  });
});
