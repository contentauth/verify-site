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

/// <reference lib="dom"/>

import type { SnapshotOptions } from '@percy/core';
import percySnapshot from '@percy/playwright';
import { expect, type Locator, type Page } from '@playwright/test';
import fs from 'fs';
import { mkdirp } from 'mkdirp';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import path from 'path';
import { fileURLToPath } from 'url';
import percyConfig from '../.percy.json' assert { type: 'json' };
import { fixturesPort } from '../playwright.config';
import testImageConfig from './c2pa-test-image-service.config';

const TALL_SNAPSHOT_HEIGHT = 2000;

const SNAPSHOT_DEBUG_MODE = process.env.SNAPSHOT_DEBUG_MODE;

type FixtureType = 'file' | 'generated';

interface ChooseFileOpts {
  waitForTree?: boolean;
  locator?: Locator;
}

export class VerifyPage {
  readonly page: Page;

  readonly languagePicker: Locator;

  constructor(page: Page) {
    this.page = page;

    this.languagePicker = page.getByLabel('Language selector');
  }

  static getFixtureUrl(filename: string, type: FixtureType = 'generated') {
    const port = type === 'file' ? fixturesPort : testImageConfig.port;

    return `http://localhost:${port}/${filename}`;
  }

  async dropFile(filename: string, filetype = 'image/jpeg') {
    const dirname = fileURLToPath(import.meta.url);
    const buffer = fs.readFileSync(
      path.resolve(dirname, `../fixtures/${filename}`),
    );

    const dataTransfer = await this.page.evaluateHandle(async (data) => {
      const dt = new DataTransfer();

      const file = new File([data.toString('hex')], filename, {
        type: filetype,
      });

      dt.items.add(file);

      return dt;
    }, buffer);

    const dropzone = this.page.getByTestId('file-dropzone');
    await dropzone.dispatchEvent('drop', { dataTransfer });
  }

  async goto(
    source: string | null = null,
    otherParams: Record<string, string> = {},
  ) {
    const params = new URLSearchParams(otherParams);

    await this.preferReducedMotion();

    if (source) {
      params.set('source', source);
      await this.page.goto(`/verify?${params.toString()}`);
      await this.treeViewVisible();
    } else {
      await this.page.goto(
        `/verify${params.keys.length > 0 ? `?${params.toString()}` : ``}`,
      );
      await this.page
        .locator('h1', { hasText: 'Inspect content to dig deeper' })
        .waitFor();
    }
  }

  async chooseFile(fixture: string, opts?: ChooseFileOpts) {
    const waitForTree = opts?.waitForTree ?? true;
    const locator =
      opts?.locator ?? this.page.getByText('Select a file from your device');

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await locator.click();
    const fileChooser = await fileChooserPromise;

    const dirname = fileURLToPath(import.meta.url);
    const file = path.resolve(dirname, `../fixtures/${fixture}`);
    await fileChooser.setFiles(file);

    if (waitForTree) {
      await this.treeViewVisible();
    }
  }

  async treeViewVisible() {
    await this.page.waitForFunction(() => {
      const loadingOverlay = document.querySelector(
        'div[data-testid="loading-overlay"]',
      );
      const treeViewThumbnails = Array.from<HTMLImageElement>(
        document.querySelectorAll('button[role="treeitem"] img'),
      );

      return (
        loadingOverlay === null &&
        treeViewThumbnails.length > 0 &&
        treeViewThumbnails.every((x) => x.complete)
      );
    });
  }

  async waitForActions() {
    const manifestDataLoc = this.page.getByTestId('manifestData');
    await manifestDataLoc.waitFor();
    expect(await manifestDataLoc.count()).toBe(1);
    const hasManifest = await manifestDataLoc.getAttribute('data-has-manifest');
    console.log('hasManifest', hasManifest);
    expect(hasManifest).toMatch(/^(true|false)$/);

    if (hasManifest === 'true') {
      await this.page
        .getByTestId('actions.editsAndActivity')
        .waitFor({ state: 'attached' });
    }
  }

  async takeDebugSnapshot(name: string, options: SnapshotOptions = {}) {
    const type = 'jpeg';
    const height = options.minHeight ?? percyConfig.snapshot['min-height'];
    const widths = options.widths ?? percyConfig.snapshot['widths'];
    const outputDir = resolve('.', 'snapshot-debug');
    await mkdirp(outputDir);

    for (const width of widths) {
      console.log('Taking debug snapshot for:', name, { width, height });
      const viewportWatcher = this.page.waitForFunction(
        (args) => window.innerWidth == args.width,
        { width },
      );
      await this.page.setViewportSize({ width, height });
      await viewportWatcher;
      const filename = [
        name.toLowerCase().replace(/\s/g, '-'),
        `${width}w`,
        type,
      ].join('.');
      const outputFile = resolve(outputDir, filename);
      const data = await this.page.screenshot({
        type,
      });
      console.log('Writing to file:', outputFile);

      await writeFile(outputFile, data);
    }
  }

  async preferReducedMotion() {
    await this.page.emulateMedia({ reducedMotion: 'reduce' });
  }

  async takeSnapshot(name: string, options: SnapshotOptions = {}) {
    if (SNAPSHOT_DEBUG_MODE) {
      await this.takeDebugSnapshot(name, options);
    }

    const domTransformation = `(documentElement) => Array.from(documentElement.querySelectorAll('span[data-testid="signedOn"]')).forEach((el) => el.innerText = 'PERCY_DATE_REPLACEMENT');`;

    await percySnapshot(this.page, `Verify: ${name}`, {
      ...options,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - not included in TS definition
      domTransformation,
    });
  }

  async takeTallSnapshot(name: string, options: SnapshotOptions = {}) {
    await this.takeSnapshot(name, {
      ...options,
      minHeight: TALL_SNAPSHOT_HEIGHT,
    });
  }
}
