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

import type { AssetData } from '$lib/asset';
import { analytics } from '$src/lib/analytics';
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
      analytics.track('selectAsset', { id: asset.id });
    },
  }));
}

const getAssetState = (id: string, selectedId: string): AssetState =>
  id === selectedId
    ? 'selected'
    : startsWith(`${selectedId}.`, `${id}.`)
      ? 'path'
      : 'none';
