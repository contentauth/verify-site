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

import type { DisposableBlobUrl } from 'c2pa';
import { isBrowserViewable } from './formats';
import type { Disposable } from './types';

export const thumbnailDataType = __THUMBNAIL_DATA_TYPE__;

export async function getBlobAsDataUri(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.onabort = reject;
    reader.readAsDataURL(blob);
  });
}

export interface ThumbnailInfo {
  mimeType: string;
  url: string;
}

export type ThumbnailResult = Disposable<{
  info: ThumbnailInfo | null;
}>;

/**
 * Right now, visual testing only works with data URIs, not blob URLs. This function will format
 * our thumbnails as data URIs if the `THUMBNAIL_DATA_TYPE` environment variable is set to `datauri`
 * on build (CI is configured to do this during the test build).
 *
 * @param mimeType The MIME type of the thumbnail
 * @param thumbnail The original thumbnail object from the JS SDK
 * @returns
 */
export async function loadThumbnail(
  mimeType: string | undefined,
  thumbnail: DisposableBlobUrl | undefined,
): Promise<ThumbnailResult> {
  const isViewable = mimeType && (await isBrowserViewable(mimeType));

  if (!mimeType || !thumbnail?.url || !isViewable) {
    return {
      info: null,
      dispose: () => {
        thumbnail?.dispose?.();
      },
    };
  }

  if (thumbnailDataType === 'datauri') {
    const request = await fetch(thumbnail.url);
    const blob = await request.blob();

    return {
      info: {
        mimeType,
        url: await getBlobAsDataUri(blob),
      },
      dispose: thumbnail.dispose,
    };
  }

  return {
    info: {
      mimeType,
      url: thumbnail.url,
    },
    dispose: thumbnail.dispose,
  };
}
