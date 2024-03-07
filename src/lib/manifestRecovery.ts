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

import type { Source } from 'c2pa';
import pLimit from 'p-limit';
import { analytics } from './analytics';
import { resultToAssetMap, type DisposableAssetDataMap } from './asset';
import { SITE_ENV } from './config';
import {
  CloudManifestError,
  ManifestRecoveryError,
  RemoteManifestError,
  S3UploadError,
  SearchUploadError,
} from './error';
import { resizeImage } from './resizeImage';
import { getSdk, getToolkitSettings } from './sdk';

const apiKey = 'cai-verify-site';
const baseParams = { api_key: apiKey };

const limit = pLimit(Math.min(navigator.hardwareConcurrency ?? 8, 8));

export const MANIFEST_STORE_MIME_TYPE = 'application/x-c2pa-manifest-store';

export type DisposableManifestRecoveryResult = DisposableAssetDataMap & {
  source: Source;
};

export type ManifestRecoveryResult = Omit<
  DisposableManifestRecoveryResult,
  'dispose'
>;

// Allows overriding of the manifest service API URL for testing, development,
// and deploy preview environments where we may run into CORS issues
export const overrideBaseUrl = __OVERRIDE_MANIFEST_RECOVERY_BASE_URL__;

export async function recoverManifests(
  sourceImage: Blob,
): Promise<DisposableManifestRecoveryResult[]> {
  // @TODO force-stage functionality?
  const baseUrl =
    overrideBaseUrl ||
    (SITE_ENV === 'prod'
      ? `https://cai-msb.adobe.io`
      : `https://cai-msb-stage.adobe.io`);
  const searchImage = await resizeImage(sourceImage);
  const { url, filename } = await getUploadUrlAndFilename(searchImage, baseUrl);

  if (await uploadToS3(url, searchImage)) {
    const timingStart = performance.now();
    const manifests = await fetchManifests(filename, baseUrl);
    const timingEnd = performance.now();
    const sdk = await getSdk();

    analytics.track('manifestRecoveryResults', {
      numResults: manifests?.results.length ?? -1,
      elapsedMs: Math.round(timingEnd - timingStart),
    });

    const fetchedManifests = manifests?.results.map(({ url }) => {
      async function processResult() {
        const resultResponse = await fetch(url.replace(/\/assets\/.*$/, ''), {
          //TODO : remove this field once it's been solved on the service side
          mode: 'cors',
        });

        if (!resultResponse.ok) {
          const error = new RemoteManifestError(resultResponse);
          analytics.trackError(error);
          throw error;
        }

        const resultData = await resultResponse.arrayBuffer();
        const blob = new Blob([resultData], {
          type: MANIFEST_STORE_MIME_TYPE,
        });

        const result = await sdk.read(blob, {
          settings: await getToolkitSettings(),
        });

        const assetMapResult = await resultToAssetMap(result);

        // @TODO add manifest filtering?
        return {
          ...assetMapResult,
          source: result.source,
        } as DisposableManifestRecoveryResult;
      }

      return limit(processResult);
    });

    if (!fetchedManifests) {
      const error = new ManifestRecoveryError();
      analytics.trackError(error);
      throw error;
    }

    return Promise.all(fetchedManifests);
  }

  return [];
}

async function getUploadUrlAndFilename(sourceImage: Blob, baseUrl: string) {
  const body = JSON.stringify({ content_type: sourceImage.type });
  const headers = { 'Content-Type': 'application/json' };
  const params = new URLSearchParams(baseParams);

  const res = await fetch(`${baseUrl}/sign_upload/v1?${params.toString()}`, {
    method: 'POST',
    body,
    headers,
  });

  if (!res.ok) {
    const error = new SearchUploadError(res);
    analytics.trackError(error);
    throw error;
  }

  return res.json();
}

async function uploadToS3(url: string, sourceImage: Blob) {
  const body = sourceImage;
  const headers = { 'Content-Type': sourceImage.type };

  analytics.track('manifestRecoveryUpload', {
    fileSize: sourceImage.size,
  });

  const res = await fetch(url, { method: 'PUT', body, headers });

  if (res.status !== 200) {
    const error = new S3UploadError(res);
    analytics.trackError(error);
    throw error;
  }

  return true;
}

interface ManifestResponse {
  results: ManifestResultItem[];
}

interface ManifestResultItem {
  signed_on: string;
  url: string;
}

async function fetchManifests(
  filename: string,
  baseUrl: string,
): Promise<ManifestResponse | null> {
  const params = new URLSearchParams({
    ...baseParams,
    filename: filename,
  });
  const response = await fetch(`${baseUrl}/manifests/v1?${params.toString()}`);

  if (!response.ok) {
    const error = new CloudManifestError(response);
    analytics.trackError(error);
    throw error;
  }

  const manifests = await response.json();

  return manifests;
}
