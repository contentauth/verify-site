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

import { ROOT_ID, type AssetData } from '$lib/asset';
import { analytics } from '$src/lib/analytics';
import type { C2paSourceType } from 'c2pa';
import debug from 'debug';
import {
  derived,
  get,
  writable,
  type Readable,
  type Writable,
} from 'svelte/store';
import { createC2paReader } from './c2paReader';
import {
  compareViewMode,
  createCompareView,
  type CompareStore,
} from './compareView';
import { createHierarchyView, type HierarchyViewStore } from './hierarchyView';
import {
  createManifestRecoverer,
  type ManifestRecovererStore,
} from './manifestRecoverer';

const dbg = debug('stores:verifyStore');

export type ViewState = 'hierarchy' | 'compare';

export type SelectedSource =
  | { type: 'local' }
  | { type: 'external'; url: string }
  | { type: 'recovery'; id: number };

export type MostRecentlyLoaded = {
  assetData?: AssetData;
  source?: SelectedSource;
  select?: () => void;
  isSelected: boolean;
};

interface VerifyStore {
  clearManifestResults: ManifestRecovererStore['clear'];
  compareView: CompareStore;
  hierarchyView: Pick<HierarchyViewStore, 'subscribe'>;
  // Gets the most recently loaded asset (i.e. was dragged in or passed via source)
  mostRecentlyLoaded: Readable<MostRecentlyLoaded>;
  readC2paSource: (source: C2paSourceType) => void;
  recoveredManifestResults: Pick<ManifestRecovererStore, 'subscribe'>;
  recoverManifests: () => void;
  setCompareActiveId: (id: string | null) => void;
  setCompareView: () => void;
  setHierarchyView: () => void;
  viewState: Readable<ViewState>;
  clear: () => void;
}

/**
 * Creates a store representing the state of the verify page, exposing the "public" API used by the page.
 */
export function createVerifyStore(): VerifyStore {
  const viewState = writable<ViewState>('hierarchy');
  const selectedSource = writable<SelectedSource>({ type: 'local' });
  const selectedAssetId = writable<string>(ROOT_ID);
  const c2paReader = createC2paReader();

  const manifestRecoverer = createManifestRecoverer(
    selectedSource,
    selectedAssetId,
  );

  const hierarchyView = createHierarchyView(
    selectedSource,
    selectedAssetId,
    c2paReader,
    manifestRecoverer,
  );

  const compareSelectedAssetIds = writable<(string | null)[]>([null, null]);
  const compareActiveAssetId = writable<string | null>(null);

  const compareView = createCompareView(
    c2paReader,
    compareSelectedAssetIds,
    compareActiveAssetId,
  );

  const mostRecentlyLoaded = derived<
    [HierarchyViewStore, Writable<SelectedSource>],
    MostRecentlyLoaded
  >(
    [hierarchyView, selectedSource],
    ([$hierarchyView, $selectedSource], set, update) => {
      if (
        $hierarchyView.state === 'success' &&
        $selectedSource.type !== 'recovery'
      ) {
        set({
          assetData: $hierarchyView.rootAsset,
          source: $selectedSource,
          isSelected: true,
        });
      } else {
        update((existing) => {
          return {
            ...existing,
            isSelected: false,
            select() {
              if (existing.source) {
                selectedSource.set(existing.source);
              }
            },
          };
        });
      }
    },
  );

  return {
    viewState,
    hierarchyView,
    compareView,
    recoveredManifestResults: manifestRecoverer,
    mostRecentlyLoaded,
    readC2paSource: (source: C2paSourceType) => {
      selectedAssetId.set(ROOT_ID);
      const existingSource = get(selectedSource);
      const incomingSource: SelectedSource =
        typeof source === 'string'
          ? {
              type: 'external',
              url: source,
            }
          : { type: 'local' };

      if (
        existingSource.type === 'external' &&
        incomingSource.type === 'external' &&
        existingSource.url === incomingSource.url
      ) {
        // Don't load a URL if it is already loaded
        return;
      }

      dbg('Reading C2PA source', source);
      c2paReader.read(source);
      manifestRecoverer.clear();
      dbg('Setting selected source', incomingSource);
      selectedSource.set(incomingSource);
    },
    clearManifestResults: () => {
      const mrlSource = get(mostRecentlyLoaded)?.source;
      manifestRecoverer.clear();

      if (mrlSource) {
        selectedSource.set(mrlSource);
      }
    },
    recoverManifests: () => {
      const reader = get(c2paReader);

      if (reader.state === 'success') {
        manifestRecoverer.recover(reader.data);
      }
    },
    setCompareView: () => {
      analytics.track('setCompareView', {
        compareMode: get(compareViewMode),
      });
      viewState.set('compare');
      const id = get(selectedAssetId);
      compareActiveAssetId.set(id);
      compareSelectedAssetIds.set([id, null]);
    },
    setHierarchyView: () => {
      analytics.track('setHierarchyView');
      viewState.set('hierarchy');
      selectedAssetId.set(get(compareActiveAssetId) ?? ROOT_ID);
    },
    setCompareActiveId: (id: string | null) => {
      compareActiveAssetId.set(id);
    },
    clear: () => {
      manifestRecoverer.clear();
      c2paReader.clear();
      selectedAssetId.set(ROOT_ID);
      selectedSource.set({ type: 'local' });
      viewState.set('hierarchy');
      compareActiveAssetId.set(null);
      compareSelectedAssetIds.set([null, null]);
    },
  };
}

export const verifyStore = createVerifyStore();
