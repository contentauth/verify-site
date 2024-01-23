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

test('Loading a PNG file should work', async ({ page }) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('CAICAI.png', 'file');
  await verify.goto(source);
});

test('Loading an SVG file should work', async ({ page }) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('CAICAI.svg', 'file');
  await verify.goto(source);
});

test('Loading a TIFF file should work', async ({ page }) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('CAICAI.tif', 'file');
  await verify.goto(source);
});

test('Loading an MP4 file should work', async ({ page }) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('CAICAI.mp4', 'file');
  await verify.goto(source);
});

test('Loading a WAV file should work', async ({ page }) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('CAICAI.wav', 'file');
  await verify.goto(source);
});

test.skip('Loading a HEIC file should work', async ({ page }) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('IMG_4056.HEIC', 'file');
  await verify.goto(source);
});

test.skip('Loading a DNG file should work', async ({ page }) => {
  const verify = new VerifyPage(page);
  const source = VerifyPage.getFixtureUrl('CAICAI.dng', 'file');
  await verify.goto(source);
});
