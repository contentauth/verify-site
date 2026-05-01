// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

interface ProducerInfo {
  name: string;
  url?: string;
}

type CreativeWorkAssertion = { data?: { author?: { name?: string; url?: string; sameAs?: string | string[] } | Array<{ name?: string; url?: string }> } };
type XmpAssertion = { data?: { 'dc:creator'?: string | string[] } };

export function selectProducer(manifest: Manifest): ProducerInfo | null {
  const assertions = manifest.assertions;

  // 1. Check CreativeWork schema
  let creativeWorkAssertion: unknown;

  if (Array.isArray(assertions)) {
    creativeWorkAssertion = assertions.find(
      (a): a is { label: string; data: unknown } =>
        typeof a === 'object' &&
        a !== null &&
        'label' in a &&
        typeof (a as Record<string, unknown>)['label'] === 'string' &&
        (a as Record<string, unknown>)['label'] === 'stds.schema-org.CreativeWork'
    );
  } else if (assertions && typeof assertions === 'object') {
    creativeWorkAssertion = (assertions as Record<string, unknown>)['stds.schema-org.CreativeWork'];
  }

  const creativeWork = (creativeWorkAssertion as CreativeWorkAssertion)?.data;

  if (creativeWork?.author) {
    const author = Array.isArray(creativeWork.author) ? creativeWork.author[0] : creativeWork.author;

    if (author?.name) {
      return { name: author.name, url: author.url };
    }
  }

  // 2. Check XMP producer/creator
  let xmpAssertion: unknown;

  if (Array.isArray(assertions)) {
    xmpAssertion = assertions.find(
      (a): a is { label: string; data: unknown } =>
        typeof a === 'object' &&
        a !== null &&
        'label' in a &&
        typeof (a as Record<string, unknown>)['label'] === 'string' &&
        (a as Record<string, unknown>)['label'] === 'stds.xmp'
    );
  } else if (assertions && typeof assertions === 'object') {
    xmpAssertion = (assertions as Record<string, unknown>)['stds.xmp'];
  }

  const xmp = (xmpAssertion as XmpAssertion)?.data;

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
