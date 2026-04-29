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
  const site =
    (manifest.assertions?.['c2pa.asset-ref'] as any)?.data?.references?.[0]?.reference?.uri ??
    (manifest.assertions?.['stds.schema-org.CreativeWork'] as any)?.data?.url;

  return site && isSecureUrl(site) ? site : null;
}
