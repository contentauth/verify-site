// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { AssetData } from '$lib/asset';
import { derived, type Readable, type Writable } from 'svelte/store';

export interface CompareAssetData extends AssetData {
  isSelected: boolean;
  isActive: boolean;

  /**
   * Set this asset as the active asset.
   */
  select: () => void;
}

export type CompareAssetStore = Readable<CompareAssetData>;

export function createCompareAssetStore(
  assetData: AssetData,
  selectedAssetIds: Writable<(string | null)[]>,
  activeAssetId: Writable<string | null>,
): CompareAssetStore {
  return derived(
    [selectedAssetIds, activeAssetId],
    ([$selectedAssetIds, $activeAssetId]) => {
      const id = assetData.id;
      const isSelected = $selectedAssetIds.includes(id);
      const isActive = $activeAssetId === id;

      return {
        ...assetData,
        isSelected,
        isActive,
        select: () => {
          if ($selectedAssetIds.every((id) => id === null)) {
            // No assets selected
            selectedAssetIds.set([id, null]);
            activeAssetId.set(id);
          } else if (isSelected && isActive) {
            // Asset is selected and active - deselect it
            const foundIdx = $selectedAssetIds.findIndex(
              (assetId) => assetId === id,
            );

            $selectedAssetIds.splice(foundIdx, 1, null);
            selectedAssetIds.set($selectedAssetIds);

            const nonNullIdx = $selectedAssetIds.findIndex(
              (assetId) => assetId !== null,
            );

            if (nonNullIdx !== -1) {
              // If another asset is selected, set it as active
              activeAssetId.set($selectedAssetIds[nonNullIdx]);
            } else {
              // else, set active asset to null
              activeAssetId.set(null);
            }
          } else if (isSelected && !isActive) {
            // Asset is selected but not active - set asset as active
            activeAssetId.set(id);
          } else if (!isSelected) {
            const nullIdx = $selectedAssetIds.findIndex(
              (assetId) => assetId === null,
            );

            // Asset is not selected - add to selection and set as active
            if (nullIdx) {
              $selectedAssetIds.splice(nullIdx, 1, id);
              selectedAssetIds.set($selectedAssetIds);
              activeAssetId.set(id);
            } else {
              // Only allow two assets to be selected at a time - remove the non-active selected asset and add the new one
              const nonActiveIdx = $selectedAssetIds.findIndex(
                (assetId) => assetId !== $activeAssetId,
              );
              $selectedAssetIds.splice(nonActiveIdx, 1, id);
              selectedAssetIds.set($selectedAssetIds);
              // set the asset to active
              activeAssetId.set(id);
            }
          }
        },
      };
    },
  );
}
