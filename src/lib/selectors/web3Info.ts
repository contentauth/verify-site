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

export function selectWeb3(manifest: Manifest): [string, string[]][] {
  interface CryptoAssertion {
    data?: Record<string, string[]>;
  }
  const assertionsArray = (manifest.assertions || []) as unknown[];
  type AssItem = { label?: string; data?: unknown };

  const cryptoAss = assertionsArray.find((a: unknown) => (a as AssItem).label === 'adobe.crypto.addresses') as CryptoAssertion | undefined;
  const cryptoEntries = cryptoAss?.data || (cryptoAss as unknown as Record<string, unknown>)?.entries || {};

  return (Object.entries(cryptoEntries) as [string, string[]][]).filter(
    ([type, [address]]) => address && ['solana', 'ethereum'].includes(type),
  );
}
