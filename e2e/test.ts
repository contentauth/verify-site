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

import { test as base, expect } from '@playwright/test';
import type { MockServiceWorker } from 'playwright-msw';
import { createWorkerFixture } from 'playwright-msw';

import handlers from './handlers';

const test = base.extend<{
  worker: MockServiceWorker;
}>({
  worker: createWorkerFixture(handlers),
});

export { expect, test };
