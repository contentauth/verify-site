// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { type Manifest, parseGenerator, selectFormattedGenerator } from 'c2pa';
import { is2xManifest } from './is2xManifest';

export function selectAppOrDeviceUsed(manifest: Manifest): string | null {
  const commonName = manifest.signatureInfo?.common_name;
  const formattedGenerator = selectFormattedGenerator(manifest);
  const finalFormattedGenerator = formattedGenerator
    ? parseGenerator(formattedGenerator)
    : null;

  return is2xManifest(manifest)
    ? (commonName ?? finalFormattedGenerator)
    : finalFormattedGenerator;
}
