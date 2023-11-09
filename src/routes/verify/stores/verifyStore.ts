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
import { getClaimUri } from '$src/lib/jumbf';
import type { Loadable } from '$src/lib/types';
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
import { createL4View, type L4ViewStore } from './l4View';
import {
  createManifestRecoverer,
  type ManifestRecovererStore,
} from './manifestRecoverer';

const dbg = debug('stores:verifyStore');

export type ViewLevel = 'L3' | 'L4';

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
  clear: () => void;
  clearManifestResults: ManifestRecovererStore['clear'];
  compareView: CompareStore;
  hierarchyView: Pick<HierarchyViewStore, 'subscribe'>;
  l4View: Pick<L4ViewStore, 'subscribe'>;
  // Gets the most recently loaded asset (i.e. was dragged in or passed via source)
  mostRecentlyLoaded: Readable<MostRecentlyLoaded>;
  readC2paSource: (source: C2paSourceType) => void;
  recoveredManifestResults: Pick<ManifestRecovererStore, 'subscribe'>;
  recoverManifests: () => void;
  selectedL4Node: Readable<any>;
  selectedL4Ref: Readable<string[] | null>;
  selectL4Ref: (ref: string[] | null) => void;
  setCompareActiveId: (id: string | null) => void;
  setCompareView: () => void;
  setHierarchyView: () => void;
  setViewLevel: (level: ViewLevel) => void;
  viewLevel: Readable<ViewLevel>;
  viewState: Readable<ViewState>;
}

/**
 * Creates a store representing the state of the verify page, exposing the "public" API used by the page.
 */
export function createVerifyStore(): VerifyStore {
  const viewState = writable<ViewState>('hierarchy');
  const viewLevel = writable<ViewLevel>('L3');
  const selectedL4Ref = writable<string[] | null>(null);
  const selectedSource = writable<SelectedSource>({ type: 'local' });
  const selectedAssetId = writable<string>(ROOT_ID);
  const c2paReader = createC2paReader();
  const l4View = createL4View(c2paReader);

  const manifestRecoverer = createManifestRecoverer(
    selectedSource,
    selectedAssetId,
  );

  const selectedAssetMap: Readable<SelectedAssetMapState> = derived(
    [selectedSource, c2paReader, manifestRecoverer],
    ([$selectedSource, $c2paReader, $manifestRecoverer]) => {
      if (['local', 'external'].includes($selectedSource.type)) {
        if ($c2paReader.state === 'success') {
          return {
            state: 'success' as const,
            data: $c2paReader.assetMap,
          };
        }

        return { state: $c2paReader.state };
      } else if ($selectedSource.type === 'recovery') {
        if ($manifestRecoverer.state === 'success') {
          const { assetMap } = get(
            $manifestRecoverer.manifests[$selectedSource.id],
          );

          return {
            state: 'success' as const,
            data: assetMap,
          };
        }
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

  const selectedL4Node = derived(
    [selectedL4Ref, l4View],
    ([$selectedRef, $l4View]) => {
      if ($l4View.state === 'success') {
        const { hierarchy } = $l4View;
        const [uri, groupId] = $selectedRef ?? [];

        if (uri) {
          const claim = hierarchy.nodes.find(
            (node: any) => node.data.uri === getClaimUri(uri),
          );

          if (groupId) {
            const group = (claim?.data as any)?.[groupId];

            return { type: groupId, ...group };
          } else {
            if (uri.includes('/c2pa.assertions/')) {
              return {
                type: 'assertion',
                assertion: (claim?.data as any)?.assertions.find(
                  (item: any) => item['uri'] === uri,
                ),
              };
            } else {
              return { type: 'manifest', ...claim };
            }
          }
        } else {
          return { type: 'manifestStore', hierarchy };
        }
      }

      return null;
    },
  );

  function resetCompare() {
    viewState.set('hierarchy');
    compareActiveAssetId.set(null);
    compareSelectedAssetIds.set([null, null]);
  }

  return {
    viewState,
    viewLevel,
    selectedL4Ref,
    selectedL4Node,
    hierarchyView,
    compareView,
    l4View,
    recoveredManifestResults: manifestRecoverer,
    mostRecentlyLoaded,
    readC2paSource: (source: C2paSourceType) => {
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
    setViewLevel: (level: ViewLevel) => {
      viewLevel.set(level);
    },
    selectL4Ref: (ref: string[] | null) => {
      selectedL4Ref.set(ref);
    },
    setCompareActiveId: (id: string | null) => {
      compareActiveAssetId.set(id);
    },
    clear: () => {
      manifestRecoverer.clear();
      c2paReader.clear();
      selectedAssetId.set(ROOT_ID);
      selectedSource.set({ type: 'local' });
      resetCompare();
    },
  };
}

export const verifyStore = createVerifyStore();
