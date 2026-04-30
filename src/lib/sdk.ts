// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { createC2pa, type Settings } from '@contentauth/c2pa-web';
import pMemoize from 'p-memoize';

const ALLOWED_LIST_CACHE_SECS = 60;

async function createSdk() {
  return createC2pa({
    wasmSrc: '/c2pa.wasm',
  });
}

export const getSdk = pMemoize(createSdk);

async function loadTrustResource(file: string): Promise<string> {
  const res = await fetch(`/trust/${file}`);

  return res.text();
}

async function getOfficialAnchors(): Promise<string> {
  return (
    await Promise.all(
      [
        'https://raw.githubusercontent.com/c2pa-org/conformance-public/refs/heads/main/trust-list/C2PA-TRUST-LIST.pem',
        'https://raw.githubusercontent.com/c2pa-org/conformance-public/refs/heads/main/trust-list/C2PA-TSA-TRUST-LIST.pem',
      ].map(async (url) => {
        const res = await fetch(url);

        return res.text();
      }),
    )
  ).join('\n');
}

async function createOfficialToolkitSettings(): Promise<Settings> {
  const anchors = await getOfficialAnchors();

  return {
    trust: {
      trustAnchors: anchors,
    },
    verify: {
      verifyTrust: true,
      verifyAfterReading: true,
    },
  };
}

async function createLegacyToolkitSettings(): Promise<Settings> {
  const officialAnchors = await getOfficialAnchors();
  const [localAnchors, allowedList] = await Promise.all(
    ['anchors.pem', 'allowed.pem'].map(loadTrustResource),
  );

  return {
    trust: {
      trustAnchors: officialAnchors + '\n' + localAnchors,
      allowedList: allowedList,
    },
    verify: {
      verifyTrust: true,
      verifyAfterReading: true,
    },
  };
}

export const getOfficialToolkitSettings = pMemoize(createOfficialToolkitSettings, {
  maxAge: 1000 * ALLOWED_LIST_CACHE_SECS,
});

export const getLegacyToolkitSettings = pMemoize(createLegacyToolkitSettings, {
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
