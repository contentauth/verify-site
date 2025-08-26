// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { type Manifest, selectFormattedGenerator } from 'c2pa';

export function selectAppOrDeviceUsed(manifest: Manifest): string | null {
  return (
    manifest.signatureInfo?.common_name ??
    selectFormattedGenerator(manifest) ??
    null
  );
}
