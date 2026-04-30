// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

interface ProducerInfo {
  name: string;
  url?: string;
}

type CreativeWorkAssertion = { data?: { author?: { name?: string; url?: string; sameAs?: string | string[] } | Array<{ name?: string; url?: string }> } };
type XmpAssertion = { data?: { 'dc:creator'?: string | string[] } };

export function selectProducer(manifest: Manifest): ProducerInfo | null {
  // 1. Check CreativeWork schema
  const creativeWork = (manifest.assertions?.['stds.schema-org.CreativeWork'] as CreativeWorkAssertion)?.data;

  if (creativeWork?.author) {
    const author = Array.isArray(creativeWork.author) ? creativeWork.author[0] : creativeWork.author;

    if (author?.name) {
      return { name: author.name, url: author.url };
    }
  }

  // 2. Check XMP producer/creator
  const xmp = (manifest.assertions?.['stds.xmp'] as XmpAssertion)?.data;

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
