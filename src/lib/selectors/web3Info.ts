// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

declare module '@contentauth/c2pa-web' {
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

type CryptoAddressData = Record<string, string[]>;

export function selectWeb3(manifest: Manifest): [string, string[]][] {
  const assertions = Array.isArray(manifest.assertions)
    ? manifest.assertions
    : [];
  const cryptoEntry = assertions.find(
    (a) => a.label === 'adobe.crypto.addresses',
  );
  const cryptoEntries =
    (cryptoEntry?.data as CryptoAddressData | undefined) ?? {};

  return (Object.entries(cryptoEntries) as [string, string[]][]).filter(
    ([type, [address]]) => address && ['solana', 'ethereum'].includes(type),
  );
}
