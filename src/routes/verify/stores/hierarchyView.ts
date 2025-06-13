// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { ROOT_ID, type AssetData, type AssetDataMap } from '$lib/asset';
import type { Loadable } from '$lib/types';
import { derived, type Readable, type Writable } from 'svelte/store';
import { createAsset, type ReadableAssetStore } from './asset';

import type { SelectedAssetMapState } from './verifyStore';

export type ReadableAssetMap = Record<string, ReadableAssetStore>;

export interface HierarchyViewStateData {
  assets: ReadableAssetMap;
  ingredientsForAssetId(id: string): AssetData[];
  rootAsset: AssetData;
  selectedAssetStore: Readable<AssetData>;
}

type HierarchyViewState = Loadable<HierarchyViewStateData>;

export type HierarchyViewStore = Readable<HierarchyViewState>;

/**
 * Creates a store representing the state of the asset hierarchy.
 *
 * @param selectedSource Source for the asset hierarchy - either "local" (file provided by user) or "recovery" (returned from manifest recovery service)
 * @param selectedAssetId Store representing the ID of the currently selected asset
 * @param c2paReader Store encapsulating the C2PA SDK logic
 * @param manifestRecoverer Store encapsulating the manifest recovery logic
 */
export function createHierarchyView(
  selectedAssetMap: Readable<SelectedAssetMapState>,
  selectedAssetId: Writable<string>,
): HierarchyViewStore {
  return derived(selectedAssetMap, ($selectedAssetMap) => {
    if ($selectedAssetMap.state === 'success') {
      return {
        state: 'success' as const,
        ...getHierarchyViewData($selectedAssetMap.data, selectedAssetId),
      };
    }

    return { state: $selectedAssetMap.state };
  });
}

function getHierarchyViewData(
  assetMap: AssetDataMap,
  selectedAssetId: Writable<string>,
): HierarchyViewStateData {
  return {
    assets: Object.values(assetMap).reduce((acc, asset) => {
      acc[asset.id] = createAsset(asset, selectedAssetId);

      return acc;
    }, {} as ReadableAssetMap),

    ingredientsForAssetId(assetId: string) {
      return (assetMap[assetId]?.children ?? [])
        .reduce<AssetData[]>((acc, childId) => {
          const childAsset = assetMap[childId];

          if (childAsset) {
            return [...acc, childAsset];
          }

          return acc;
        }, [])
        .sort(
          (a, b) =>
            (b.manifestData?.date?.valueOf() ?? 0) -
            (a.manifestData?.date?.valueOf() ?? 0),
        );
    },

    rootAsset: assetMap[ROOT_ID],

    selectedAssetStore: derived(
      selectedAssetId,
      ($selectedAssetId) => assetMap[$selectedAssetId],
    ),
  };
}
