// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { resultToAssetMap, type AssetDataMap } from '$lib/asset';
import { getLegacySdk, getSdk, getToolkitSettings } from '$lib/sdk';
import type { Loadable } from '$lib/types';
import {
  somethingWentWrong,
  toast,
  unsupportedFileType,
} from '$src/features/Toast';
import { openModal } from 'svelte-modals';
import { writable, type Readable } from 'svelte/store';
import LegacyCredentialModal from '../components/modals/LegacyCredentialModal/LegacyCredentialModal.svelte';

interface SourceData {
  assetMap: AssetDataMap;
  data: any; // Raw crJSON manifest store
}

export type SourceState = Loadable<SourceData>;
export type ReadableSource = Readable<SourceState>;

export interface C2paReaderStore extends Readable<SourceState> {
  read: (source: Blob | File) => Promise<void>;
  clear: () => void;
}

const mimeTypeCorrections = {
  'audio/x-m4a': 'audio/mp4',
  'audio/x-wav': 'audio/wav',
  'audio/wave': 'audio/wav',
  'audio/vnd.wave': 'audio/wav',
  'image/dng': 'image/x-adobe-dng',
};

export function createC2paReader(): C2paReaderStore {
  let dispose: () => void;
  const { subscribe, set } = writable<SourceState>({ state: 'none' });

  return {
    subscribe,
    read: async (source: Blob | File) => {
      set({ state: 'loading' });
      dispose?.();

      try {
        const sdk = await getSdk();
        const sourceType = source instanceof Blob ? source.type : '';
        const normalizedSourceType = sourceType.toLowerCase().trim();
        const needsCorrectedType =
          !sourceType ||
          sourceType !== normalizedSourceType ||
          Object.keys(mimeTypeCorrections).includes(normalizedSourceType);

        if (source instanceof File && needsCorrectedType) {
          const ext = source.name?.toLowerCase();
          let correctedType: string | undefined = undefined;

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

        const settings = await getToolkitSettings();
        const reader = await sdk.reader.fromBlob(source.type || 'application/octet-stream', source, settings);

        if (!reader) {
          throw new Error('No C2PA manifest found in this file');
        }

        const rawManifestStore = await reader.manifestStore();

        const { assetMap, dispose: assetMapDisposer } =
          await resultToAssetMap({ manifestStore: rawManifestStore, source }); 
        dispose = () => {
          assetMapDisposer();
        };

        set({
          state: 'success',
          assetMap,
          data: rawManifestStore,
        });
      } catch (e: unknown) {
        const errStr = String(e);
        const errName = (e as Record<string, unknown>)?.name;

        if (errName === 'InvalidMimeTypeError' || errStr.includes('Unsupported format')) {
          toast.trigger(unsupportedFileType());
        } else if (
          (errName === 'C2pa(PrereleaseError)' || errStr.includes('Prerelease')) &&
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

async function hasLegacyCredentials(source: Blob | File): Promise<boolean> {
  const legacySdk = await getLegacySdk();
  const legacyResult = await legacySdk.processImage(source);
  return legacyResult.exists;
}
