// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from 'c2pa';
import { isSecureUrl } from '../url';

declare module 'c2pa' {
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
    manifest.assertions.get('c2pa.asset-ref')[0]?.data.references[0]?.reference
      .uri ??
    manifest.assertions.get('stds.schema-org.CreativeWork')[0]?.data.url;

  return site && isSecureUrl(site) ? site : null;
}
