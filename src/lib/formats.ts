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

import pMemoize from 'p-memoize';

export const MEDIA_CATEGORIES = ['audio', 'image', 'video', 'unknown'] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];

export interface FormatDefinition {
  name: string;
  category: MediaCategory;
  browserViewable: () => Promise<boolean>;
  searchable: boolean;
}

const fileSamples = {
  'image/avif':
    'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAOptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAEOAAEAAAAAAAAAFAAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAamlwcnAAAABLaXBjbwAAABNjb2xybmNseAACAAIABoAAAAAMYXYxQ4EgAgAAAAAUaXNwZQAAAAAAAAABAAAAAQAAABBwaXhpAAAAAAMICAgAAAAXaXBtYQAAAAAAAAABAAEEgYIDhAAAABxtZGF0EgAKBDgABgkyChgAAABABfXvZOg=',
  'image/heic':
    'data:image/heic;base64,AAAAGGZ0eXBoZWljAAAAAGhlaWNtaWYxAAAB4G1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAHBpY3QAAAAAAAAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAADnBpdG0AAAAAAAEAAAA4aWluZgAAAAAAAgAAABVpbmZlAgAAAAABAABodmMxAAAAABVpbmZlAgAAAQACAABFeGlmAAAAABppcmVmAAAAAAAAAA5jZHNjAAIAAQABAAABA2lwcnAAAADiaXBjbwAAABNjb2xybmNseAACAAIABoAAAAByaHZjQwEDcAAAALAAAAAAAB7wAPz9+PgAAAsDoAABABdAAQwB//8DcAAAAwCwAAADAAADAB5wJKEAAQAkQgEBA3AAAAMAsAAAAwAAAwAeoBQgQcChBBiHuRZVNwICBgCAogABAAlEAcBgwLIQFMkAAAAUaXNwZQAAAAAAAAACAAAAAgAAAChjbGFwAAAAAQAAAAEAAAABAAAAAf/AAAAAgAAA/8AAAACAAAAAAAAJaXJvdAAAAAAQcGl4aQAAAAADCAgIAAAAGWlwbWEAAAAAAAAAAQABBoGCA4SFBgAAACxpbG9jAAAAAEQAAAIAAQAAAAEAAAJgAAAAHQACAAAAAQAAAggAAABYAAAAAW1kYXQAAAAAAAAAhQAAAAZFeGlmAABNTQAqAAAACAAEARIAAwAAAAEAAQAAARoABQAAAAEAAAA+ARsABQAAAAEAAABGASgAAwAAAAEAAgAAAAAAAAAAAEgAAAABAAAASAAAAAEAAAAZKAGvolT7bB+6j/ITt/QLyKMvD2Rus1+lQA==',
  'image/heif':
    'data:image/heif;base64,AAAAGGZ0eXBoZWljAAAAAG1pZjFoZWljAAABZm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAHBpY3QAAAAAAAAAAAAAAAAAAAAADnBpdG0AAAAAAAEAAAAiaWxvYwAAAABEQAABAAEAAAAAAYYAAQAAAAAAAAArAAAAI2lpbmYAAAAAAAEAAAAVaW5mZQIAAAAAAQAAaHZjMQAAAADmaXBycAAAAMdpcGNvAAAAc2h2Y0MBA3AAAAAAAAAAAAAe8AD8/fj4AAAPAyAAAQAYQAEMAf//A3AAAAMAkAAAAwAAAwAeugJAIQABACdCAQEDcAAAAwCQAAADAAADAB6gIIEFluqumubAgAAAAwCAAAADAIQiAAEABkQBwXPBiQAAABRpc3BlAAAAAAAAAEAAAABAAAAAKGNsYXAAAAABAAAAAQAAAAEAAAAB////wQAAAAL////BAAAAAgAAABBwaXhpAAAAAAMICAgAAAAXaXBtYQAAAAAAAAABAAEEgQKDhAAAADNtZGF0AAAAJygBrxMhMZb4TlCn//1nhc0MlUxauU+lc90KUJNyfrj+8oeTxWKC4A==',
};

export const SUPPORTED_FORMATS: Record<string, FormatDefinition> = {
  'image/jpeg': {
    name: 'JPEG',
    category: 'image',
    browserViewable: async () => true,
    searchable: true,
  },
  'image/png': {
    name: 'PNG',
    category: 'image',
    browserViewable: async () => true,
    searchable: true,
  },
  'image/svg+xml': {
    name: 'SVG',
    category: 'image',
    browserViewable: async () => true,
    searchable: false,
  },
  'image/x-adobe-dng': {
    name: 'DNG',
    category: 'image',
    browserViewable: async () => false,
    searchable: false,
  },
  'image/tiff': {
    name: 'TIFF',
    category: 'image',
    browserViewable: async () => false,
    searchable: false,
  },
  'image/webp': {
    name: 'WebP',
    category: 'image',
    browserViewable: async () => true,
    searchable: false,
  },
  'image/avif': {
    name: 'AVIF',
    category: 'image',
    browserViewable: async () => memoizedTestImageSupport('image/avif'),
    searchable: false,
  },
  'image/heic': {
    name: 'HEIC',
    category: 'image',
    browserViewable: async () => memoizedTestImageSupport('image/heic'),
    searchable: false,
  },
  'image/heif': {
    name: 'HEIF',
    category: 'image',
    browserViewable: async () => memoizedTestImageSupport('image/heif'),
    searchable: false,
  },
  'audio/mp4': {
    name: 'M4A',
    category: 'audio',
    browserViewable: async () => false,
    searchable: false,
  },
  'audio/mpeg': {
    name: 'MP3',
    category: 'audio',
    browserViewable: async () => false,
    searchable: false,
  },
  'audio/wav': {
    name: 'WAV',
    category: 'audio',
    browserViewable: async () => false,
    searchable: false,
  },
  'application/mp4': {
    name: 'MP4',
    category: 'video',
    browserViewable: async () => true,
    searchable: false,
  },
  'video/mp4': {
    name: 'MP4',
    category: 'video',
    browserViewable: async () => true,
    searchable: false,
  },
};

function testImageSupport(
  mimeType: keyof typeof fileSamples,
): Promise<boolean> {
  return new Promise((resolve) => {
    const img = document.createElement('img');

    img.onload = () => {
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };

    img.src = fileSamples[mimeType];
  });
}

const memoizedTestImageSupport = pMemoize(testImageSupport);

export async function isBrowserViewable(mimeType: string) {
  const format = SUPPORTED_FORMATS[mimeType];

  if (format) {
    return format.browserViewable();
  }

  return false;
}
