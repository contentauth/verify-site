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

type CryptoAddressAssertion = { data?: Record<string, string[]> };

export function selectWeb3(manifest: Manifest): [string, string[]][] {
  const assertions = manifest.assertions;
  let cryptoAssertion: unknown;

  if (Array.isArray(assertions)) {
    cryptoAssertion = assertions.find(
      (a): a is { label: string; data: unknown } =>
        typeof a === 'object' &&
        a !== null &&
        'label' in a &&
        typeof (a as Record<string, unknown>)['label'] === 'string' &&
        (a as Record<string, unknown>)['label'] === 'adobe.crypto.addresses'
    );
  } else if (assertions && typeof assertions === 'object') {
    cryptoAssertion = (assertions as Record<string, unknown>)['adobe.crypto.addresses'];
  }

  const cryptoEntries = (cryptoAssertion as CryptoAddressAssertion)?.data ?? {};

  return (Object.entries(cryptoEntries) as [string, string[]][]).filter(
    ([type, [address]]) => address && ['solana', 'ethereum'].includes(type),
  );
}
