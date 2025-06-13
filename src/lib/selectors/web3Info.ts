// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from 'c2pa';

declare module 'c2pa' {
  interface Reference {
    uri: string;
  }
  interface Resource {
    reference: Reference;
  }
  interface ExtendedAssertions {
    'adobe.crypto.addresses': {
      ethereum?: string[];
      solana?: string[];
    };
  }
}

export function selectWeb3(manifest: Manifest): [string, string[]][] {
  const cryptoEntries =
    manifest.assertions.get('adobe.crypto.addresses')[0]?.data ?? {};

  return (Object.entries(cryptoEntries) as [string, string[]][]).filter(
    ([type, [address]]) => address && ['solana', 'ethereum'].includes(type),
  );
}
