// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { type Manifest, parseGenerator } from 'c2pa';
import { is2xManifest } from './is2xManifest';

export function selectAppOrDeviceUsed(manifest: Manifest): string {
  // Order of precedence:
  // 1. 2.x manifest only: certificate common name
  // 2. claim_generator_info
  // 3. claim_generator

  const commonName = manifest.signatureInfo?.common_name;

  const claimGeneratorInfo = manifest.claimGeneratorInfo.find(
    (val) => val?.name,
  );

  const claimGeneratorLabel = claimGeneratorInfo?.name
    ? `${claimGeneratorInfo.name.replace(/_/g, ' ')}${claimGeneratorInfo.version ? ` ${claimGeneratorInfo.version.replace(/\([^()]*\)/g, '')}` : ''}`
    : null;

  const claimGenerator = manifest.claimGenerator
    ? parseGenerator(manifest.claimGenerator)
    : null;

  const generator =
    claimGeneratorLabel ?? claimGenerator ?? 'Unknown Generator';

  return is2xManifest(manifest) ? (commonName ?? generator) : generator;
}
