// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

interface ProducerInfo {
  name: string;
  url?: string;
}

type CreativeWorkAssertion = {
  data?: {
    author?:
      | { name?: string; url?: string; sameAs?: string | string[] }
      | Array<{ name?: string; url?: string }>;
  };
};
type XmpAssertion = { data?: { 'dc:creator'?: string | string[] } };

export function selectProducer(manifest: Manifest): ProducerInfo | null {
  const assertions = Array.isArray(manifest.assertions)
    ? manifest.assertions
    : [];

  // 1. Check CreativeWork schema
  const creativeWorkEntry = assertions.find(
    (a) => a.label === 'stds.schema-org.CreativeWork',
  );
  const creativeWork =
    (creativeWorkEntry?.data as CreativeWorkAssertion['data']) ?? undefined;

  if (creativeWork?.author) {
    const author = Array.isArray(creativeWork.author)
      ? creativeWork.author[0]
      : creativeWork.author;

    if (author?.name) {
      return { name: author.name, url: author.url };
    }
  }

  // 2. Check XMP producer/creator
  const xmpEntry = assertions.find((a) => a.label === 'stds.xmp');
  const xmp = (xmpEntry?.data as XmpAssertion['data']) ?? undefined;

  if (xmp?.['dc:creator']) {
    const creator = Array.isArray(xmp['dc:creator'])
      ? xmp['dc:creator'][0]
      : xmp['dc:creator'];

    return { name: creator };
  }

  // 3. Fallback to certificate subject common name
  const commonName = manifest.signature_info?.common_name;

  if (commonName) {
    return { name: commonName };
  }

  return null;
}
