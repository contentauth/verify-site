// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { ROOT_ID, type AssetData, type AssetDataMap } from '$lib/asset';
import type { Loadable } from '$src/lib/types';

import debug from 'debug';
import {
  derived,
  get,
  writable,
  type Readable,
  type Writable,
} from 'svelte/store';
import { createC2paReader } from './c2paReader';
import { createCompareView, type CompareStore } from './compareView';
import { createHierarchyView, type HierarchyViewStore } from './hierarchyView';

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

export type SelectedAssetMapState = Loadable<{
  data: AssetDataMap;
}>;

interface VerifyStore {
  compareView: CompareStore;
  hierarchyView: Pick<HierarchyViewStore, 'subscribe'>;
  // Gets the most recently loaded asset (i.e. was dragged in or passed via source)
  mostRecentlyLoaded: Readable<MostRecentlyLoaded>;
  readC2paSource: (source: Blob | File | string) => void;
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

  const selectedAssetMap: Readable<SelectedAssetMapState> = derived(
    [selectedSource, c2paReader],
    ([$selectedSource, $c2paReader]) => {
      if (['local', 'external'].includes($selectedSource.type)) {
        if ($c2paReader.state === 'success') {
          return {
            state: 'success' as const,
            data: $c2paReader.assetMap,
          };
        }

        return { state: $c2paReader.state };
      }

      return { state: 'none' as const };
    },
  );

  const hierarchyView = createHierarchyView(selectedAssetMap, selectedAssetId);

  const compareSelectedAssetIds = writable<(string | null)[]>([null, null]);
  const compareActiveAssetId = writable<string | null>(null);

  const compareView = createCompareView(
    selectedAssetMap,
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

  function resetCompare() {
    viewState.set('hierarchy');
    compareActiveAssetId.set(null);
    compareSelectedAssetIds.set([null, null]);
  }

  return {
    viewState,
    hierarchyView,
    compareView,
    mostRecentlyLoaded,
    readC2paSource: async (source: Blob | File | string) => {
      resetCompare();
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
      
      let finalSource: Blob | File;

      if (typeof source === 'string') {
        try {
          const response = await fetch(source);

          if (!response.ok) {
            throw new Error(`HTTP error fetching external C2PA source! Status: ${response.status}`);
          }

          finalSource = await response.blob();
        } catch (err) {
          dbg('Failed asynchronous remote fetch C2PA source link:', err);
          // Re-throw to ensure errors are visible, but you could also handle state down-grading here
          throw err;
        }
      } else {
        finalSource = source;
      }

      c2paReader.read(finalSource);
      dbg('Setting selected source', incomingSource);
      selectedSource.set(incomingSource);
    },
    setCompareView: () => {
      viewState.set('compare');
      const id = get(selectedAssetId);
      compareActiveAssetId.set(id);
      compareSelectedAssetIds.set([id, null]);
    },
    setHierarchyView: () => {
      viewState.set('hierarchy');
      selectedAssetId.set(get(compareActiveAssetId) ?? ROOT_ID);
    },
    setCompareActiveId: (id: string | null) => {
      compareActiveAssetId.set(id);
    },
    clear: () => {
      c2paReader.clear();
      selectedAssetId.set(ROOT_ID);
      selectedSource.set({ type: 'local' });
      resetCompare();
    },
  };
}

export const verifyStore = createVerifyStore();
