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
import { type Page } from '@playwright/test';
import { mkdirp } from 'mkdirp';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import percyConfig from '../../.percy.json' assert { type: 'json' };
import { fixturesPort } from '../../playwright.config';
import testImageConfig from '../c2pa-test-image-service.config';

const TALL_SNAPSHOT_HEIGHT = 2000;

const SNAPSHOT_DEBUG_MODE = process.env.SNAPSHOT_DEBUG_MODE;

type FixtureType = 'file' | 'generated';

export class VerifyPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static getFixtureUrl(filename: string, type: FixtureType = 'generated') {
    const port = type === 'file' ? fixturesPort : testImageConfig.port;

    return `http://localhost:${port}/${filename}`;
  }

  async goto(source: string | null = null) {
    if (source) {
      const params = new URLSearchParams({ source });
      await this.page.goto(`/verify?${params.toString()}`);
      await this.waitForTreeView();
    } else {
      await this.page.goto('/verify');
      await this.page
        .locator('span', { hasText: 'Drag and drop anywhere' })
        .waitFor();
    }
  }

  async waitForTreeView() {
    await this.page.waitForFunction(() => {
      const treeViewThumbnails = Array.from<HTMLImageElement>(
        document.querySelectorAll('button[role="treeitem"] img'),
      );

      return (
        treeViewThumbnails.length > 0 &&
        treeViewThumbnails.every((x) => x.complete)
      );
    });
  }

  async takeDebugSnapshot(name: string, options: SnapshotOptions = {}) {
    const type = 'jpeg';
    const height = options.minHeight ?? percyConfig.snapshot['min-height'];
    const widths = percyConfig.snapshot['widths'];
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

  async takeSnapshot(name: string, options: SnapshotOptions = {}) {
    if (SNAPSHOT_DEBUG_MODE) {
      await this.takeDebugSnapshot(name, options);
    }

    await percySnapshot(this.page, `Verify: ${name}`, options);
  }

  async takeTallSnapshot(name: string, options: SnapshotOptions = {}) {
    await this.takeSnapshot(name, {
      ...options,
      minHeight: TALL_SNAPSHOT_HEIGHT,
    });
  }
}
