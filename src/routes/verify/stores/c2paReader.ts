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

import { resultToAssetMap, type AssetDataMap } from '$lib/asset';
import { getLegacySdk, getSdk } from '$lib/sdk';
import type { Loadable } from '$lib/types';
import {
  somethingWentWrong,
  toast,
  unsupportedFileType,
} from '$src/features/Toast';
import type { Source as C2paSource, C2paSourceType } from 'c2pa';
import { openModal } from 'svelte-modals';
import { writable, type Readable } from 'svelte/store';
import LegacyCredentialModal from '../components/modals/LegacyCredentialModal/LegacyCredentialModal.svelte';

interface SourceData {
  assetMap: AssetDataMap;
  data: C2paSource;
}

export type SourceState = Loadable<SourceData>;
export type ReadableSource = Readable<SourceState>;

export interface C2paReaderStore extends Readable<SourceState> {
  /**
   * @param source Source to read c2pa data from
   */
  read: (source: C2paSourceType) => Promise<void>;
}

/**
 * Creates a store encapsulating the C2PA SDK file reading logic.
 */
export function createC2paReader(): C2paReaderStore {
  let dispose: () => void;
  const { subscribe, set } = writable<SourceState>({ state: 'none' });

  return {
    subscribe,
    read: async (source: C2paSourceType) => {
      set({ state: 'loading' });
      dispose?.();

      try {
        const sdk = await getSdk();

        if (source instanceof File && !source.type) {
          const ext = source.name?.toLowerCase();
          let correctedType: string | undefined = undefined;

          // TODO: Transition to detection with magic numbers so that this works when
          // passed in as a URL
          if (ext.endsWith('.dng')) {
            correctedType = 'image/x-adobe-dng';
          } else if (ext.endsWith('.heic')) {
            correctedType = 'image/heic';
          }

          if (correctedType) {
            const buffer = await source.arrayBuffer();
            source = new Blob([buffer], { type: correctedType });
          }
        }

        const result = await sdk.read(source);

        const { assetMap, dispose: assetMapDisposer } =
          await resultToAssetMap(result);
        dispose = assetMapDisposer;

        set({
          state: 'success',
          assetMap,
          data: result.source,
        });
      } catch (e) {
        if ((e as Record<string, unknown>)?.name === 'InvalidMimeTypeError') {
          toast.trigger(unsupportedFileType());
        } else if (
          (e as Record<string, unknown>)?.name === 'C2pa(PrereleaseError)' &&
          (await hasLegacyCredentials(source))
        ) {
          openModal(LegacyCredentialModal);
        } else {
          toast.trigger(somethingWentWrong());
        }

        console.error('createC2paReader.read() error:', e);
        set({ state: 'none' });
      }
    },
  };
}

async function hasLegacyCredentials(source: C2paSourceType): Promise<boolean> {
  const legacySdk = await getLegacySdk();
  const legacyResult = await legacySdk.processImage(source);

  return legacyResult.exists;
}
