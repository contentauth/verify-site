// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { type Manifest } from 'c2pa';

export function is2xManifest(manifest: Manifest): boolean {
  return manifest.label?.startsWith('urn:c2pa') ?? false;
}
