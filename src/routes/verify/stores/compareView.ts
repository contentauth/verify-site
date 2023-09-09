// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import type { Loadable } from '$lib/types';
import type { AssetData } from '$src/lib/asset';
import local from 'store2';
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import type { C2paReaderStore } from './c2paReader';
import {
  createCompareAssetStore,
  type CompareAssetStore,
} from './compareAsset';
import {
  createCompareSelectedAssetStore,
  type CompareSelectedAssetStore,
} from './compareSelectedAsset';

const STORAGE_MODE_KEY = 'compareMode';

export type CompareAssetStoreMap = Record<string, CompareAssetStore>;

interface CompareStoreData {
  compareAssetMap: CompareAssetStoreMap;
  selectedAssets: Readable<(CompareSelectedAssetStore | null)[]>;
  activeAssetData: Readable<AssetData | null>;
}

type CompareStoreState = Loadable<CompareStoreData>;

export type CompareStore = Readable<CompareStoreState>;

export function createCompareView(
  c2paReader: C2paReaderStore,
  selectedAssetIds: Writable<(string | null)[]>,
  activeAssetId: Writable<string | null>,
): CompareStore {
  return derived(c2paReader, ($c2paReader) => {
    if ($c2paReader.state === 'success') {
      return {
        state: 'success' as const,
        compareAssetMap: Object.values($c2paReader.assetMap).reduce(
          (acc, asset) => {
            acc[asset.id] = createCompareAssetStore(
              asset,
              selectedAssetIds,
              activeAssetId,
            );

            return acc;
          },
          {} as CompareAssetStoreMap,
        ),
        selectedAssets: derived(selectedAssetIds, ($selectedAssetIds) =>
          $selectedAssetIds.map((assetId) =>
            assetId
              ? createCompareSelectedAssetStore(
                  $c2paReader.assetMap[assetId],
                  activeAssetId,
                )
              : null,
          ),
        ),
        activeAssetData: derived(activeAssetId, ($activeAssetId) =>
          $activeAssetId ? $c2paReader.assetMap[$activeAssetId] : null,
        ),
      };
    }

    return {
      state: $c2paReader.state,
    };
  });
}

export type CompareMode = 'Side by Side' | 'Slider';

/**
 * Specifies the active compare mode on the comparison view
 */
export const compareMode = writable<CompareMode>(
  local.get(STORAGE_MODE_KEY) || 'Side By Side',
);

/**
 * Sets the comparison mode
 * @param mode CompareMode
 */
export function setCompareMode(mode: CompareMode) {
  compareMode.set(mode);
  local.set(STORAGE_MODE_KEY, mode);
}
