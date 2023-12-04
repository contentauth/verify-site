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

test.describe('Verify - assertion display', () => {
  test('exif data should be displayed correctly', async ({ page }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('exif');
    await verify.goto(source);
    const altText = 'Map showing approximate location';
    await page.getByAltText(altText).waitFor();
    await verify.takeTallSnapshot(`result for generated exif image`, {
      widths: [1280],
    });
  });

  test('ai model usage (do not train) should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('dnt');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result for ai model usage image`, {
      widths: [1280],
    });
  });

  test('image with inference metadata should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('inference');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result for image with inference metadata`, {
      widths: [1280],
    });
  });

  test('image without inference metadata should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('no-inference');
    await verify.goto(source);
    await verify.takeTallSnapshot(
      `result for image without inference metadata`,
      { widths: [1280] },
    );
  });

  test('image with legacy generative AI assertion should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('legacy-trained-algorithmic-media');
    await verify.goto(source);
    await verify.takeTallSnapshot(
      `result for image with legacy gen AI assertion`,
      {
        widths: [1280],
      },
    );
  });

  test('image with v1 actions generative AI assertion should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl(
      'v1-actions-trained-algorithmic-media',
    );
    await verify.goto(source);
    await verify.takeTallSnapshot(
      `result for image with v1 actions trained algorithmic media assertion`,
      {
        widths: [1280],
      },
    );
  });

  test('image with composite AI assertion should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl(
      'v1-actions-composite-algorithmic-media',
    );
    await verify.goto(source);
    await verify.takeTallSnapshot(
      `result for image with v1 actions composite algorithmic media assertion`,
      {
        widths: [1280],
      },
    );
  });

  test('image with review ratings should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('review-ratings');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result for review ratings image`, {
      widths: [1280],
    });
  });

  test('adobe stock image should be displayed correctly', async ({ page }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('adobe-stock');
    await verify.goto(source);
    await verify.waitForActions();
    await verify.takeTallSnapshot(`result for adobe stock image`, {
      widths: [1280],
    });
  });

  test('(XSS) image with a non-https website or social link should not render those values as interactive links', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('xss');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result for XSS image`, {
      widths: [1280],
    });
  });

  test('image without all other assertions should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('kitchen-sink');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result for kitchen sink image`, {
      widths: [1280],
    });
  });
});
