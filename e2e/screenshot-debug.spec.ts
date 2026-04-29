import { test } from '@playwright/test';
import fs from 'fs';

test('Capture and analyze header layout', async ({ page }) => {
  // 1. Load the page
  await page.goto('/');

  // 2. Upload the legacy image
  const filePath = '/usr/local/google/home/sherifhanna/github/resources/samples/legacy/adobe_test_image_red_house_birds.jpg';
  await page.setInputFiles('input[type="file"]', filePath);

  // 3. Wait for the Legacy Trust banner to appear in the header
  const banner = page.getByText('Legacy trust', { exact: true }).first();
  await banner.waitFor({ timeout: 10000 });

  // 4. Take a screenshot of the specific header row
  const headerRow = banner.locator('xpath=ancestor::div[contains(@class, "flex") and contains(@class, "items-center")]').first();
  await headerRow.screenshot({ path: 'e2e/legacy_header_debug.png' });

  // 5. Extract the exact DOM structure and computed styles
  const layoutDump = await headerRow.evaluate((el) => {
    const icon = el.querySelector('svg');
    const wrapper = el.querySelector('.truncate');
    const desc = wrapper?.querySelector('div'); // <Description> renders a div or p
    const span = el.querySelector('span');

    return {
      html: el.outerHTML,
      measurements: {
        iconRight: icon?.getBoundingClientRect().right,
        wrapperLeft: wrapper?.getBoundingClientRect().left,
        spanLeft: span?.getBoundingClientRect().left,
        spanPaddingLeft: span ? window.getComputedStyle(span).paddingLeft : null,
        iconMarginRight: icon ? window.getComputedStyle(icon).marginRight : null,
      }
    };
  });

  console.log('--- DOM SNAPSHOT ---');
  console.log(layoutDump.html);
  console.log('--- PIXEL MEASUREMENTS ---');
  console.log(`Icon Right Edge: ${layoutDump.measurements.iconRight}px`);
  console.log(`Text Wrapper Left Edge: ${layoutDump.measurements.wrapperLeft}px`);
  console.log(`Legacy Span Left Edge: ${layoutDump.measurements.spanLeft}px`);
  console.log(`Icon Margin-Right (CSS): ${layoutDump.measurements.iconMarginRight}`);
  console.log(`Span Padding-Left (CSS): ${layoutDump.measurements.spanPaddingLeft}`);
  
  const gap = layoutDump.measurements.spanLeft! - layoutDump.measurements.iconRight!;
  console.log(`ACTUAL PIXEL GAP: ${gap}px`);
});
