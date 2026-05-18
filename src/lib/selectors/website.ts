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

export function selectWebsite(manifest: Manifest): string | null {
  interface AssetRefAssertion {
    data?: {
      references?: Array<{ reference?: { uri?: string } }>;
    };
  }
  interface CreativeWorkAssertion {
    data?: {
      url?: string;
    };
  }
  const assertionsArray = (manifest.assertions || []) as unknown[];
  type AssItem = { label?: string; data?: unknown };

  const assetRefAss = assertionsArray.find((a: unknown) => (a as AssItem).label === 'c2pa.asset-ref') as AssetRefAssertion | undefined;
  const creativeWorkAss = assertionsArray.find((a: unknown) => (a as AssItem).label === 'stds.schema-org.CreativeWork') as CreativeWorkAssertion | undefined;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const site = (assetRefAss?.data?.references?.[0]?.reference?.uri || creativeWorkAss?.data?.url || (creativeWorkAss as any)?.url || null) as string | null;

  return site && isSecureUrl(site) ? site : null;
}
