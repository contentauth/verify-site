// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { AssetData } from '$lib/asset';
import { startsWith } from 'lodash';
import { derived, type Readable, type Writable } from 'svelte/store';

type AssetState = 'selected' | 'path' | 'none';

export interface ReadableAssetData extends AssetData {
  state: AssetState;

  /**
   * Set this asset as the active asset.
   */
  select: () => void;
}

export type ReadableAssetStore = Readable<ReadableAssetData>;

/**
 * Creates a store representing an individual asset.
 * Methods are exposed to modify the state of this asset, which may affect the state of the entire asset tree.
 *
 * @param asset Underlying asset data
 * @param selectedId Writable store representing the currently selected asset ID
 */
export function createAsset(
  asset: AssetData,
  selectedId: Writable<string>,
): ReadableAssetStore {
  return derived(selectedId, ($selectedId) => ({
    ...asset,
    state: getAssetState(asset.id, $selectedId),
    select: () => {
      selectedId.set(asset.id);
    },
  }));
}

const getAssetState = (id: string, selectedId: string): AssetState =>
  id === selectedId
    ? 'selected'
    : startsWith(`${selectedId}.`, `${id}.`)
      ? 'path'
      : 'none';
