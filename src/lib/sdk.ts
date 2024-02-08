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

import allowedList from '$assets/certs/allowed.pem?raw';
import { createC2pa } from 'c2pa';
import wasmSrc from 'c2pa/dist/assets/wasm/toolkit_bg.wasm?url';
import workerSrc from 'c2pa/dist/c2pa.worker.min.js?url';
import pMemoize from 'p-memoize';

async function createSdk() {
  return createC2pa({
    wasmSrc,
    workerSrc,
    allowedList,
    downloaderOptions: {
      inspectSize: 0,
    },
  });
}

export const getSdk = pMemoize(createSdk);

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
