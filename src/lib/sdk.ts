// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { createC2pa, type ToolkitSettings } from 'c2pa';
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

async function loadTrustResource(file: string): Promise<string> {
  const res = await fetch(`/trust/${file}`);

  return res.text();
}

async function createToolkitSettings(): Promise<ToolkitSettings> {
  const [anchors, endEntity, config] = await Promise.all(
    ['anchors.pem', 'allowed.sha256.txt', 'store.cfg'].map(loadTrustResource),
  );

  return {
    trust: {
      trustConfig: config,
      trustAnchors: anchors,
      allowedList: endEntity,
    },
    verify: {
      verifyTrust: true,
    },
  };
}

export const getToolkitSettings = pMemoize(createToolkitSettings, {
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
