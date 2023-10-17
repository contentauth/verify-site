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
    await verify.takeSnapshot(`result for CAICAI.jpg via source`);
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
    await verify.takeSnapshot(`result for fake-news.jpg via source`, {
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

  test('source thumbnail should show if image does not have a thumbnail and hashes are valid', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('no-thumbnail.jpg', 'file');
    await verify.goto(source);
    await verify.takeSnapshot(`result showing valid claim without thumbnail`);
  });
});
