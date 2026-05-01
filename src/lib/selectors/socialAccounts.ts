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
  
  type VcData = { id?: string; account?: { service?: string; identifier?: string } };

  for (const cred of credentials) {
    // Simplified mapping logic for standard social media VC schemas
    const vcData = (cred as { credentialSubject?: VcData })?.credentialSubject || {};

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
  type CreativeWorkAssertion = { data?: { author?: { sameAs?: string | string[] } } };
  const assertions = manifest.assertions;
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

  const creativeWork = (creativeWorkAssertion as CreativeWorkAssertion)?.data;

  if (creativeWork?.author?.sameAs) {
    const urls = Array.isArray(creativeWork.author.sameAs) 
      ? creativeWork.author.sameAs 
      : [creativeWork.author.sameAs];
      
    for (const url of urls) {
      if (url.includes('twitter.com') || url.includes('x.com')) {
        accounts.push({ '@id': url, '@type': 'Organization', name: url.split('/').pop() || url, identifier: 'twitter' });
      } else if (url.includes('instagram.com')) {
        accounts.push({ '@id': url, '@type': 'Organization', name: url.split('/').pop() || url, identifier: 'instagram' });
      } else if (url.includes('linkedin.com')) {
        accounts.push({ '@id': url, '@type': 'Organization', name: url.split('/').pop() || url, identifier: 'linkedin' });
      }
    }
  }

  return accounts;
}
