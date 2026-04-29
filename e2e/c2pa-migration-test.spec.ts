import { test, expect } from '@playwright/test';

const TEST_ASSETS = [
  {
    name: 'Google Camera Capture (V2 Manifest)',
    path: '/usr/local/google/home/sherifhanna/github/resources/samples/Google/Photos Prod/camera-capture_cropped.jpg',
    expectedState: 'valid'
  },
  {
    name: 'OpenAI ChatGPT Image (V3 Manifest with untrusted timestamp)',
    path: '/usr/local/google/home/sherifhanna/github/resources/samples/OpenAI/ChatGPT Image Apr 28, 2026, 08_28_37 AM.png',
    expectedState: 'valid' // Should be valid (green) now that we filter timestamp info codes
  }
];

test.describe('Native crJSON E2E Verification', () => {
  for (const asset of TEST_ASSETS) {
    test(`should successfully validate: ${asset.name}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: Error[] = [];

      // Listen for console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Listen for uncaught page errors
      page.on('pageerror', err => {
        pageErrors.push(err);
      });

      await page.goto('/');

      // Upload the file
      await page.setInputFiles('input[type="file"]', asset.path);

      // Wait for the processing to complete and the panel to appear
      await expect(page.getByText('Content Credentials', { exact: false })).toBeVisible({ timeout: 15000 });

      // Assert that NO "Unrecognized" (orange) banner is present
      // This ensures our V3 timestamp logic is correctly ignoring informational timestamp codes
      const orangeBanner = page.getByText('issuer couldn’t be recognized', { exact: false });
      await expect(orangeBanner).toBeHidden();

      // Assert that no console errors occurred during the native crJSON hydration
      const actualErrors = consoleErrors.filter(err => 
        !err.includes('Lit is in dev mode') && 
        !err.includes('Spectrum Web Components is in dev mode') &&
        !err.includes('<Root> was created without expected prop') &&
        !err.includes('ERR_BLOCKED_BY_CLIENT')
      );

      expect(pageErrors.length).toBe(0);
      expect(actualErrors.length).toBe(0);
    });
  }
});
