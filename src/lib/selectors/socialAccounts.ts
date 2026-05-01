// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

export interface SocialAccount {
  '@id': string;
  '@type': string;
  name: string;
  identifier: string;
}

export function selectSocialAccounts(manifest: Manifest): SocialAccount[] {
  const accounts: SocialAccount[] = [];

  // Look through verified credentials if present
  const credentials = manifest.credentials || [];

  for (const cred of credentials) {
    // Simplified mapping logic for standard social media VC schemas
    const credRecord = cred as Record<string, unknown>;
    type VcData = {
      id?: string;
      account?: { service?: string; identifier?: string };
    };
    const vcData = (credRecord.credentialSubject as VcData) || {};

    if (vcData?.account?.service && vcData?.account?.identifier) {
      accounts.push({
        '@id': vcData.id || '',
        '@type': 'Organization',
        name: vcData.account.identifier,
        identifier: vcData.account.service,
      });
    }
  }

  // Also check standard CreativeWork assertions for "sameAs" social URLs
  type CreativeWorkData = { author?: { sameAs?: string | string[] } };
  const assertionsArr = Array.isArray(manifest.assertions)
    ? manifest.assertions
    : [];
  const creativeWorkEntry = assertionsArr.find(
    (a) => a.label === 'stds.schema-org.CreativeWork',
  );
  const creativeWork = creativeWorkEntry?.data as CreativeWorkData | undefined;

  if (creativeWork?.author?.sameAs) {
    const urls = Array.isArray(creativeWork.author.sameAs)
      ? creativeWork.author.sameAs
      : [creativeWork.author.sameAs];

    for (const url of urls) {
      if (url.includes('twitter.com') || url.includes('x.com')) {
        accounts.push({
          '@id': url,
          '@type': 'Organization',
          name: url.split('/').pop() || url,
          identifier: 'twitter',
        });
      } else if (url.includes('instagram.com')) {
        accounts.push({
          '@id': url,
          '@type': 'Organization',
          name: url.split('/').pop() || url,
          identifier: 'instagram',
        });
      } else if (url.includes('linkedin.com')) {
        accounts.push({
          '@id': url,
          '@type': 'Organization',
          name: url.split('/').pop() || url,
          identifier: 'linkedin',
        });
      }
    }
  }

  return accounts;
}
