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

type AssetRefData = { references?: Array<{ reference?: { uri?: string } }> };
type CreativeWorkData = { url?: string };

export function selectWebsite(manifest: Manifest): string | null {
  const assertions = Array.isArray(manifest.assertions)
    ? manifest.assertions
    : [];
  const assetRefEntry = assertions.find((a) => a.label === 'c2pa.asset-ref');
  const creativeWorkEntry = assertions.find(
    (a) => a.label === 'stds.schema-org.CreativeWork',
  );

  const site =
    (assetRefEntry?.data as AssetRefData | undefined)?.references?.[0]
      ?.reference?.uri ??
    (creativeWorkEntry?.data as CreativeWorkData | undefined)?.url;

  return site && isSecureUrl(site) ? site : null;
}
