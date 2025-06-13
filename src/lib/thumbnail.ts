// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { DisposableBlobUrl } from 'c2pa';
import DOMPurify from 'dompurify';
import { startsWith } from 'lodash';
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
 * This also does a check on the MIME type to make sure that the browser can load the type of media
 * being passed, and if not, will return `null` for its `info` key. For a majority of thumbnails this
 * test should pass, but may fail if we are showing the source data (e.g. for a video that browsers
 * don't have codec support for, etc.)
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
  let processedThumbnail: typeof thumbnail = thumbnail;

  if (!mimeType || !processedThumbnail?.url || !isViewable) {
    return {
      info: null,
      dispose: () => {
        processedThumbnail?.dispose?.();
      },
    };
  }

  // Make sure we strip out any XSS attacks from SVGs
  if (thumbnail?.url && startsWith(mimeType, 'image/svg')) {
    const request = await fetch(thumbnail.url);
    const source = await request.text();
    const sanitized = new Blob([DOMPurify.sanitize(source)], {
      type: mimeType,
    });
    const sanitizedUrl = URL.createObjectURL(sanitized);

    processedThumbnail = {
      url: sanitizedUrl,
      dispose: () => {
        URL.revokeObjectURL(sanitizedUrl);
        thumbnail.dispose();
      },
    };
  }

  if (thumbnailDataType === 'datauri') {
    const request = await fetch(processedThumbnail.url);
    const blob = await request.blob();

    return {
      info: {
        mimeType,
        url: await getBlobAsDataUri(blob),
      },
      dispose: processedThumbnail.dispose,
    };
  }

  return {
    info: {
      mimeType,
      url: processedThumbnail.url,
    },
    dispose: processedThumbnail.dispose,
  };
}
