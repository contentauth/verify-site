// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Loadable } from '$lib/types';
import type { AssetData } from '$src/lib/asset';
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import {
  createCompareAssetStore,
  type CompareAssetStore,
} from './compareAsset';
import {
  createCompareSelectedAssetStore,
  type CompareSelectedAssetStore,
} from './compareSelectedAsset';
import type { SelectedAssetMapState } from './verifyStore';

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
  selectedAssetMap: Readable<SelectedAssetMapState>,
  selectedAssetIds: Writable<(string | null)[]>,
  activeAssetId: Writable<string | null>,
): CompareStore {
  return derived(selectedAssetMap, ($selectedAssetMap) => {
    if ($selectedAssetMap.state === 'success') {
      return {
        state: 'success' as const,
        compareAssetMap: Object.values($selectedAssetMap.data).reduce(
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
                  $selectedAssetMap.data[assetId],
                  activeAssetId,
                )
              : null,
          ),
        ),
        activeAssetData: derived(activeAssetId, ($activeAssetId) =>
          $activeAssetId ? $selectedAssetMap.data[$activeAssetId] : null,
        ),
      };
    }

    return {
      state: $selectedAssetMap.state,
    };
  });
}

export type CompareMode = 'sideBySide' | 'slider';

function createCompareViewMode() {
  const local: CompareMode = localStorage.getItem(
    STORAGE_MODE_KEY,
  ) as CompareMode;
  const compareMode = writable<CompareMode>(local || 'sideBySide');

  return {
    subscribe: compareMode.subscribe,
    set: (mode: CompareMode) => {
      compareMode.set(mode);
      localStorage.setItem(STORAGE_MODE_KEY, mode);
    },
  };
}

export const compareViewMode = createCompareViewMode();
