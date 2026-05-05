// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

interface ProducerInfo {
  name: string;
  url?: string;
}

export function selectProducer(manifest: Manifest): ProducerInfo | null {
  const assertionsArray = (manifest.assertions || []) as unknown[];
  type AssItem = { label?: string; data?: unknown };

  // 1. Check CreativeWork schema item
  const creativeWorkAss = assertionsArray.find((a: unknown) => (a as AssItem).label === 'stds.schema-org.CreativeWork') as AssItem | undefined;
  const creativeWork = (creativeWorkAss?.data || creativeWorkAss) as Record<string, unknown> | undefined;

  if (creativeWork?.author) {
    const author = Array.isArray(creativeWork.author) ? creativeWork.author[0] : creativeWork.author;

    if (author?.name) {
      return { name: author.name, url: author.url };
    }
  }

  // 2. Check XMP producer/creator item
  const xmpAss = assertionsArray.find((a: unknown) => (a as AssItem).label === 'stds.xmp') as AssItem | undefined;
  const xmp = (xmpAss?.data || xmpAss) as Record<string, unknown> | undefined;

  if (xmp?.['dc:creator']) {
    const creator = Array.isArray(xmp['dc:creator']) ? xmp['dc:creator'][0] : xmp['dc:creator'];

    return { name: creator };
  }

  // 3. Fallback to certificate subject common name
  const commonName = manifest.signature_info?.common_name;

  if (commonName) {
    return { name: commonName };
  }

  return null;
}
