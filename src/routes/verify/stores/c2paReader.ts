// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { resultToAssetMap, type AssetDataMap } from '$lib/asset';
import { getLegacySdk, getSdk, getToolkitSettings } from '$lib/sdk';
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
  clear: () => void;
}

const mimeTypeCorrections = {
  // Chrome registers M4A as MP4
  'audio/x-m4a': 'audio/mp4',
  // Normalize WAV types
  'audio/x-wav': 'audio/wav',
  'audio/wave': 'audio/wav',
  'audio/vnd.wave': 'audio/wav',
  // DNG on Windows/Firefox
  'image/dng': 'image/x-adobe-dng',
};

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
        const sourceType = source instanceof Blob ? source.type : '';
        const normalizedSourceType = sourceType.toLowerCase().trim();
        const needsCorrectedType =
          // Source type is missing
          !sourceType ||
          // Source type is not lowercase / has weird spacing
          sourceType !== normalizedSourceType ||
          // We have a remapping for different variations
          Object.keys(mimeTypeCorrections).includes(normalizedSourceType);

        if (source instanceof File && needsCorrectedType) {
          const ext = source.name?.toLowerCase();
          let correctedType: string | undefined = undefined;

          // TODO: Transition to detection with magic numbers so that this works when
          // passed in as a URL
          if (source.type && needsCorrectedType) {
            correctedType =
              mimeTypeCorrections[
                normalizedSourceType as keyof typeof mimeTypeCorrections
              ];
          } else if (ext.endsWith('.arw')) {
            correctedType = 'image/tiff';
          } else if (ext.endsWith('.dng')) {
            correctedType = 'image/x-adobe-dng';
          } else if (ext.endsWith('.nef')) {
            correctedType = 'image/tiff';
          } else if (ext.endsWith('.heic')) {
            correctedType = 'image/heic';
          } else if (ext.endsWith('.heif')) {
            correctedType = 'image/heif';
          } else if (ext.endsWith('.mov')) {
            correctedType = 'video/quicktime';
          } else {
            correctedType = normalizedSourceType;
          }

          if (correctedType) {
            const buffer = await source.arrayBuffer();
            source = new File([buffer], source.name, { type: correctedType });
          }
        }

        const result = await sdk.read(source, {
          settings: await getToolkitSettings(),
        });

        const { assetMap, dispose: assetMapDisposer } =
          await resultToAssetMap(result);
        dispose = assetMapDisposer;

        set({
          state: 'success',
          assetMap,
          data: result.source,
        });
      } catch (e: unknown) {
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
    clear: () => {
      dispose?.();
      set({ state: 'none' });
    },
  };
}

async function hasLegacyCredentials(source: C2paSourceType): Promise<boolean> {
  const legacySdk = await getLegacySdk();
  const legacyResult = await legacySdk.processImage(source);

  return legacyResult.exists;
}
