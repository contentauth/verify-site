// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { AssetData } from '$lib/asset';
import { derived, type Readable, type Writable } from 'svelte/store';

interface CompareSelectedAssetData extends AssetData {
  isActive: boolean;

  /**
   * Set this asset as the active asset.
   */
  select: () => void;
}

export type CompareSelectedAssetStore = Readable<CompareSelectedAssetData>;

export function createCompareSelectedAssetStore(
  assetData: AssetData,
  activeAssetId: Writable<string | null>,
): CompareSelectedAssetStore {
  return derived([activeAssetId], ([$activeAssetId]) => {
    const id = assetData.id;
    const isActive = $activeAssetId === id;

    return {
      ...assetData,
      isActive,
      select: () => {
        activeAssetId.set(assetData.id);
      },
    };
  });
}
