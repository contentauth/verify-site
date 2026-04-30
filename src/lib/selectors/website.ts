// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';
import { isSecureUrl } from '../url';

declare module '@contentauth/c2pa-web' {
  interface Reference {
    uri: string;
  }
  interface Resource {
    reference: Reference;
  }
  interface ExtendedAssertions {
    'c2pa.asset-ref': {
      references: Resource[];
    };
  }
}

type AssetRefAssertion = { data?: { references?: Array<{ reference?: { uri?: string } }> } };
type CreativeWorkAssertion = { data?: { url?: string } };

export function selectWebsite(manifest: Manifest): string | null {
  const assertions = manifest.assertions;
  let assetRefAssertion: unknown;

  if (Array.isArray(assertions)) {
    assetRefAssertion = assertions.find(
      (a): a is { label: string; data: unknown } =>
        typeof a === 'object' &&
        a !== null &&
        'label' in a &&
        typeof (a as Record<string, unknown>)['label'] === 'string' &&
        (a as Record<string, unknown>)['label'] === 'c2pa.asset-ref'
    );
  } else if (assertions && typeof assertions === 'object') {
    assetRefAssertion = (assertions as Record<string, unknown>)['c2pa.asset-ref'];
  }

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

  const site =
    (assetRefAssertion as AssetRefAssertion)?.data?.references?.[0]?.reference?.uri ??
    (creativeWorkAssertion as CreativeWorkAssertion)?.data?.url;

  return site && isSecureUrl(site) ? site : null;
}
