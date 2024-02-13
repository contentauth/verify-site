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

import { createC2pa, type C2paReadOptions } from 'c2pa';
import wasmSrc from 'c2pa/dist/assets/wasm/toolkit_bg.wasm?url';
import workerSrc from 'c2pa/dist/c2pa.worker.min.js?url';
import pMemoize from 'p-memoize';

const ALLOWED_LIST_CACHE_SECS = 60;

async function createSdk() {
  return createC2pa({
    wasmSrc,
    workerSrc,
    downloaderOptions: {
      inspectSize: 0,
    },
  });
}

export const getSdk = pMemoize(createSdk);

async function createReadOpts(): Promise<C2paReadOptions> {
  const allowedListRes = await fetch('/allowed.txt');
  const allowedList = await allowedListRes.text();

  return {
    allowedList,
  };
}

export const getReadOpts = pMemoize(createReadOpts, {
  maxAge: 1000 * ALLOWED_LIST_CACHE_SECS,
});

async function createLegacySdk() {
  const wasmSrc =
    'https://cdn.jsdelivr.net/npm/@contentauth/sdk@0.8.12/dist/assets/wasm/toolkit_bg.wasm';
  const workerSrc =
    'https://cdn.jsdelivr.net/npm/@contentauth/sdk@0.8.12/dist/cai-sdk.worker.min.js';
  const sdkSrc = 'https://cdn.jsdelivr.net/npm/@contentauth/sdk@0.8.12';
  // Suppressing dynamic import warning about not being able to be analyzed by Vite, which is expected
  const { ContentAuth } = await import(/* @vite-ignore */ sdkSrc);

  return new ContentAuth({
    wasmSrc,
    workerSrc,
  });
}

export const getLegacySdk = pMemoize(createLegacySdk);
