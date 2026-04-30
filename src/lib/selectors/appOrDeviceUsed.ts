// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { type Manifest } from '@contentauth/c2pa-web';
import { is2xManifest } from './is2xManifest';

function parseLegacyGenerator(generator: string): string {
  return generator.split('/')[0].replace(/_/g, ' ').trim();
}

export function selectAppOrDeviceUsed(manifest: Manifest): string {
  // Order of precedence:
  // 1. 2.x manifest only: certificate common name
  // 2. claim_generator_info
  // 3. claim_generator

  const commonName = manifest.signature_info?.common_name;

  const claimGeneratorInfo = manifest.claim_generator_info?.find(
    (val) => val?.name,
  );

  const claimGeneratorLabel = claimGeneratorInfo?.name
    ? `${claimGeneratorInfo.name.replace(/_/g, ' ')}${claimGeneratorInfo.version ? ` ${claimGeneratorInfo.version.replace(/\([^()]*\)/g, '')}` : ''}`
    : null;

  const claimGenerator = manifest.claim_generator
    ? parseLegacyGenerator(manifest.claim_generator)
    : null;

  const generator =
    claimGeneratorLabel ?? claimGenerator ?? 'Unknown Generator';

  return is2xManifest(manifest) ? (commonName ?? generator) : generator;
}
