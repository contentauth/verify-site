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

import { ROOT_ID, type AssetData, type AssetDataMap } from '$lib/asset';
import { analytics } from '$src/lib/analytics';
import type { Loadable } from '$src/lib/types';
import type { C2paSourceType } from 'c2pa';
import { get, writable, type Readable, type Writable } from 'svelte/store';
import { createC2paReader } from './c2paReader';
import {
  compareViewMode,
  createCompareView,
  type CompareStore,
} from './compareView';
import { createHierarchyView, type HierarchyViewStore } from './hierarchyView';

export type ViewState = 'hierarchy' | 'compare';

export type SelectedSource =
  | { type: 'local' }
  | { type: 'external'; url: string };

export type MostRecentlyLoaded = {
  assetData?: AssetData;
  source?: SelectedSource;
  select?: () => void;
};

export type SelectedAssetMapState = Loadable<{
  data: AssetDataMap;
}>;

export interface VerifyStore {
  viewState: Writable<ViewState>;
  hierarchyView: HierarchyViewStore;
  compareView: CompareStore;
  mostRecentlyLoaded: Readable<MostRecentlyLoaded>;
  readC2paSource: (source: C2paSourceType) => void;
  clearManifestResults: () => void;
  setCompareView: () => void;
  setHierarchyView: () => void;
  setCompareActiveId: (id: string | null) => void;
  clear: () => void;
}

/**
 * Creates a store representing the state of the verify page, exposing the "public" API used by the page.
 */
export function createVerifyStore(): VerifyStore {
  const viewState = writable<ViewState>('hierarchy');
  const selectedAssetId = writable<string>(ROOT_ID);
  const selectedAssetMap = writable<SelectedAssetMapState>({ state: 'none' });
  const hierarchyView = createHierarchyView(selectedAssetMap, selectedAssetId);
  const compareSelectedAssetIds = writable<(string | null)[]>([null, null]);
  const compareActiveAssetId = writable<string | null>(null);
  const compareView = createCompareView(
    selectedAssetMap,
    compareSelectedAssetIds,
    compareActiveAssetId,
  );
  const mostRecentlyLoaded = writable<MostRecentlyLoaded>({});
  const c2paReader = createC2paReader();

  function clearManifestResults() {
    selectedAssetMap.set({ state: 'none' });
    compareSelectedAssetIds.set([null, null]);
    compareActiveAssetId.set(null);
    mostRecentlyLoaded.set({});
  }

  function setCompareView() {
    analytics.track('setCompareView', {
      compareMode: get(compareViewMode),
    });
    viewState.set('compare');
    const id = get(selectedAssetId);
    compareActiveAssetId.set(id);
    compareSelectedAssetIds.set([id, null]);
  }

  function setHierarchyView() {
    analytics.track('setHierarchyView');
    viewState.set('hierarchy');
    selectedAssetId.set(get(compareActiveAssetId) ?? ROOT_ID);
  }

  function setCompareActiveId(id: string | null) {
    compareActiveAssetId.set(id);
  }

  function clear() {
    clearManifestResults();
    c2paReader.clear();
    selectedAssetId.set(ROOT_ID);
  }

  async function readC2paSource(source: C2paSourceType) {
    clearManifestResults();

    try {
      await c2paReader.read(source);
      const sourceState = get(c2paReader);

      if (sourceState.state === 'success') {
        selectedAssetMap.set({ state: 'success', data: sourceState.assetMap });
        mostRecentlyLoaded.set({
          assetData: sourceState.assetMap[ROOT_ID],
          source:
            typeof source === 'string'
              ? { type: 'external', url: source }
              : { type: 'local' },
          select() {
            selectedAssetId.set(ROOT_ID);
          },
        });
      }
    } catch (error) {
      console.error('Error reading C2PA source:', error);
    }
  }

  return {
    viewState,
    hierarchyView,
    compareView,
    mostRecentlyLoaded,
    readC2paSource,
    clearManifestResults,
    setCompareView,
    setHierarchyView,
    setCompareActiveId,
    clear,
  };
}

export const verifyStore = createVerifyStore();
