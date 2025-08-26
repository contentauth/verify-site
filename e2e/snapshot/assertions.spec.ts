// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { test } from '@playwright/test';
import { VerifyPage } from '../page';

test.describe('Verify - assertion display', () => {
  test.skip('exif data should be displayed correctly', async ({ page }) => {
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

  test('image with v2 actions should show gen AI content summaries if present', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('v2-actions-genai-content-summary');
    await verify.goto(source);
    await verify.takeTallSnapshot(`result v2 actions with gen AI`, {
      widths: [1280],
    });
  });

  test.skip('adobe stock image should be displayed correctly', async ({
    page,
  }) => {
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

  test('gen ai images with undefined software agents should not show an AI tool used section', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl(
      'undefined-software-agent.jpg',
      'file',
    );
    await verify.goto(source);
    await verify.waitForActions();
    await verify.takeTallSnapshot(
      `result for gen ai image with undefined software agent`,
      {
        widths: [1280],
      },
    );
  });

  test('image with claim_generator v2 should display correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await page.setViewportSize({ width: 1024, height: 1024 });
    const source = VerifyPage.getFixtureUrl('claim-generator-info');
    await verify.goto(source);
    await verify.takeSnapshot('result for image with claim generator v2', {
      widths: [1024],
    });
  });

  test('image with claim_generator v2 without a version should display correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    await page.setViewportSize({ width: 1024, height: 1024 });
    const source = VerifyPage.getFixtureUrl('claim-generator-info-no-version');
    await verify.goto(source);
    await verify.takeSnapshot(
      'result for image with claim generator v2 no version',
      {
        widths: [1024],
      },
    );
  });

  test('image with embedded icon in claim_generator_info should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl(
      'embedded-generator-icon.jpg',
      'file',
    );
    await verify.goto(source);
    await verify.page.waitForFunction(() => {
      return (
        document.querySelector<HTMLImageElement>(
          'img[data-testid="embedded-generator-icon"]',
        )?.complete === true
      );
    });
    await verify.takeSnapshot(
      `result for image with embedded icon in claim_generator_info`,
      {
        widths: [1024],
      },
    );
  });

  test('gen ai images with custom models should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl('custom-model.jpg', 'file');
    await verify.goto(source);
    await verify.waitForActions();
    await verify.takeTallSnapshot(`result for gen ai image with custom model`, {
      widths: [1280],
    });
  });

  test.skip('CAWG identity data should be displayed correctly', async ({
    page,
  }) => {
    const verify = new VerifyPage(page);
    const source = VerifyPage.getFixtureUrl(
      'adobe_connected_identities.jpg',
      'file',
    );
    await verify.goto(source);
    await verify.waitForActions();
    await verify.takeTallSnapshot(`result for gen CAWG identity`, {
      widths: [1280],
    });
  });
});
