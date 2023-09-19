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

import { recoverManifests } from '$lib/manifestRecovery';
import type { Loadable } from '$lib/types';
import { matchesUnavailable, toast } from '$src/features/Toast';
import type { Source } from 'c2pa';
import { writable, type Readable, type Writable } from 'svelte/store';
import {
  createRecoveredManifest,
  type ReadableRecoveredManifestStore,
} from './recoveredManifest';
import type { SelectedSource } from './verifyStore';

interface RecoveredManifestData {
  manifests: ReadableRecoveredManifestStore[];
}

type ManifestRecoveryState = Loadable<RecoveredManifestData>;

export interface ManifestRecovererStore
  extends Readable<ManifestRecoveryState> {
  clear: () => void;
  recover: (source: Source) => Promise<void>;
}

/**
 * Creates a store encapsulating the manifest recovery logic.
 *
 * @param selectedSource Selected source store - used to update the selected source when a recovered manifest is selected
 * @param selectedAssetId Store representing the ID of the currently selected asset
 */
export function createManifestRecoverer(
  selectedSource: Writable<SelectedSource>,
  selectedAssetId: Writable<string>,
): ManifestRecovererStore {
  const disposers: (() => void)[] = [];
  const manifestRecoveryState = writable<ManifestRecoveryState>({
    state: 'none',
  });

  return {
    subscribe: manifestRecoveryState.subscribe,
    clear: () => {
      manifestRecoveryState.set({ state: 'none' });
    },
    recover: async ({ blob }: Source) => {
      manifestRecoveryState.set({ state: 'loading' });

      while (disposers?.length) {
        disposers.pop()?.();
      }

      try {
        if (!blob) {
          return manifestRecoveryState.set({ state: 'none' });
        }

        const recoveredManifests = await recoverManifests(blob);

        manifestRecoveryState.set({
          state: 'success',
          manifests: recoveredManifests.map(
            ({ dispose, ...recoveredManifest }, idx) => {
              disposers.push(dispose);

              return createRecoveredManifest(
                recoveredManifest,
                idx,
                selectedSource,
                selectedAssetId,
              );
            },
          ),
        });
      } catch (e) {
        toast.trigger(matchesUnavailable());
        console.error(e);
        manifestRecoveryState.set({ state: 'none' });
      }
    },
  };
}
