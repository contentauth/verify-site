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
import { fixturesPort } from '../../playwright.config';

const TALL_SNAPSHOT_HEIGHT = 2000;

export class VerifyPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static getFixtureUrl(filename: string) {
    return `http://localhost:${fixturesPort}/${filename}`;
  }

  async goto(source: string | null = null) {
    if (source) {
      const params = new URLSearchParams({ source });
      await this.page.goto(`/verify?${params.toString()}`);
      await this.waitForTreeView();
      await this.page.waitForTimeout(50); // only for debugging
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

  async takeSnapshot(name: string, options: SnapshotOptions = {}) {
    await percySnapshot(this.page, `Verify: ${name}`, options);
  }

  async takeTallSnapshot(name: string, options: SnapshotOptions = {}) {
    await this.takeSnapshot(name, {
      ...options,
      minHeight: TALL_SNAPSHOT_HEIGHT,
    });
  }
}
