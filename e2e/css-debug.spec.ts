import { test } from '@playwright/test';
import path from 'path';

test('Diagnose CSS gap between Cr pin and Legacy banner', async ({ page }) => {
  await page.goto('/');

  const filePath = '/usr/local/google/home/sherifhanna/github/resources/samples/legacy/adobe_test_image_red_house_birds.jpg';
  await page.setInputFiles('input[type="file"]', filePath);

  // Wait for the legacy banner to appear
  await page.waitForSelector('text=Legacy trust');

  // Evaluate the computed styles in the browser context
  const layoutData = await page.evaluate(() => {
    // Find the main header container
    const bannerSpan = Array.from(document.querySelectorAll('span')).find(s => s.textContent?.includes('Legacy trust'));
    if (!bannerSpan) return 'Banner not found';

    const descriptionEl = bannerSpan.parentElement;
    const truncateEl = descriptionEl?.parentElement;
    const flexRow = truncateEl?.parentElement;
    
    // Assuming L1Icon is the SVG before the truncate wrapper
    const iconEl = flexRow?.querySelector('svg');

    const getStyles = (el: Element | null | undefined) => {
      if (!el) return null;
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        tagName: el.tagName,
        className: el.className,
        display: styles.display,
        margin: `${styles.marginTop} ${styles.marginRight} ${styles.marginBottom} ${styles.marginLeft}`,
        padding: `${styles.paddingTop} ${styles.paddingRight} ${styles.paddingBottom} ${styles.paddingLeft}`,
        width: styles.width,
        left: rect.left,
        right: rect.right,
      };
    };

    return {
      icon: getStyles(iconEl),
      truncate: getStyles(truncateEl),
      description: getStyles(descriptionEl),
      banner: getStyles(bannerSpan),
      gapDistance: (truncateEl && iconEl) ? truncateEl.getBoundingClientRect().left - iconEl.getBoundingClientRect().right : null
    };
  });

  console.log('--- COMPUTED CSS LAYOUT ---');
  console.log(JSON.stringify(layoutData, null, 2));
  console.log('---------------------------');
});
