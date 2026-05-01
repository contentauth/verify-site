// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { resultToAssetMap, type AssetDataMap } from '$lib/asset';
import { getLegacySdk, getSdk, getOfficialToolkitSettings, getLegacyToolkitSettings } from '$lib/sdk';
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
  data: unknown;
}

export type SourceState = Loadable<SourceData>;
export type ReadableSource = Readable<SourceState>;

export interface C2paReaderStore extends Readable<SourceState> {
  read: (source: Blob | File | string) => Promise<void>;
  clear: () => void;
}

const mimeTypeCorrections = {
  'audio/x-m4a': 'audio/mp4',
  'audio/x-wav': 'audio/wav',
  'audio/wave': 'audio/wav',
  'audio/vnd.wave': 'audio/wav',
  'image/dng': 'image/x-adobe-dng',
};

type ValidationStatus = { code: string };
type TrustSource = 'official' | 'legacy' | 'none';
type TrustedIngredient = { trust_source?: TrustSource; active_manifest?: string; validation_status?: ValidationStatus[] };
type TrustedManifest = { trust_source?: TrustSource; ingredients?: TrustedIngredient[] };
type ValidationDelta = { ingredientAssertionURI?: string; validationDeltas?: { failure?: ValidationStatus[] } };

export function createC2paReader(): C2paReaderStore {
  let dispose: () => void;
  const { subscribe, set } = writable<SourceState>({ state: 'none' });

  return {
    subscribe,
    read: async (source: Blob | File | string) => {
      set({ state: 'loading' });
      dispose?.();

      try {
        if (typeof source === 'string') {
          const response = await fetch(source);
          source = await response.blob();
        }

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

        // PASS 1: Validate against Official Trust List
        const officialSettings = await getOfficialToolkitSettings();
        const reader = await sdk.reader.fromBlob(source.type || 'application/octet-stream', source, officialSettings);

        if (!reader) {
          throw new Error('No C2PA manifest found in this file');
        }

        const rawManifestStore = await reader.manifestStore();

        let finalStore = rawManifestStore;
        let currentReader = reader;

        // 1. Check if Pass 1 failed to achieve a fully 'Trusted' state.
        const needsLegacyPass = rawManifestStore.validation_state !== 'Trusted';

        // 2. Run Pass 2 ONLY if the official pass wasn't perfectly trusted
        if (needsLegacyPass) {
          const legacySettings = await getLegacyToolkitSettings();
          const legacyReader = await sdk.reader.fromBlob(source.type || 'application/octet-stream', source, legacySettings);
          
          if (legacyReader) {
            const legacyStore = await legacyReader.manifestStore();

            // 3. ONLY ADOPT Pass 2 if it actually solved the problem (State is now Trusted/Valid)
            if (legacyStore.validation_state === 'Trusted' || legacyStore.validation_state === 'Valid') {
              finalStore = legacyStore;
              
              reader.free();
              currentReader = legacyReader;

              const isTrustError = (s: ValidationStatus) => s.code.includes('signingCredential.untrusted') || s.code.includes('signingCredential.invalid');

              // 4a. Tag the Active Manifest
              const p1ActiveV3 = (rawManifestStore.validation_results?.activeManifest?.failure || []) as ValidationStatus[];
              const p1ActiveV2 = (rawManifestStore.manifests?.[rawManifestStore.active_manifest || '']?.validation_status || []) as ValidationStatus[];
              const wasActiveUntrusted = p1ActiveV3.some(isTrustError) || p1ActiveV2.some(isTrustError);
              const isFinalTrusted = finalStore.validation_state === 'Trusted';
              
              if (finalStore.manifests && finalStore.active_manifest && finalStore.manifests[finalStore.active_manifest]) {
                const activeMan = finalStore.manifests[finalStore.active_manifest] as unknown as TrustedManifest;

                // If the root is Trusted, default to official, then downgrade if Pass 1 failed.
                if (isFinalTrusted) {
                  activeMan.trust_source = wasActiveUntrusted ? 'legacy' : 'official';
                } else {
                  activeMan.trust_source = 'none';
                }
              }

              // 4b. Tag ALL Ingredients across the entire provenance tree
              const p1Deltas = (rawManifestStore.validation_results?.ingredientDeltas || []) as ValidationDelta[];

              (Object.entries(finalStore.manifests || {}) as Array<[string, TrustedManifest]>).forEach(([label, manifest]) => {
                const p1Manifest = rawManifestStore.manifests?.[label];

                if (manifest.ingredients && p1Manifest?.ingredients) {
                  manifest.ingredients.forEach((ingredient, index) => {
                    // ZERO TRUST DEFAULT: Unverified assets get no trust credentials
                    ingredient.trust_source = 'none';

                    if (ingredient.active_manifest) {
                      const p1Ing = p1Manifest.ingredients?.[index];
                      const subLabel = ingredient.active_manifest;
                      const p1SubManifest = (subLabel ? rawManifestStore.manifests?.[subLabel] : null) as Record<string, unknown> | null;

                      // 1. Check the Ingredient Pointer (V2 standard)
                      const p1V2_ing = (p1Ing?.validation_status || []) as ValidationStatus[];

                      // 2. Check the actual Sub-Manifest directly (V2 + V3 standards)
                      // NOTE: In V3, the sub-manifest's own results are stored under .activeManifest
                      const p1V2_sub = (p1SubManifest?.validation_status || []) as ValidationStatus[];
                      const p1V3_sub = ((p1SubManifest?.validation_results as Record<string, unknown> | undefined)?.activeManifest as Record<string, unknown> | undefined)?.failure as ValidationStatus[] | undefined || [];

                      // 3. Check the Root Deltas (V3 standard)
                      const p1Delta = p1Deltas.find((d) =>
                        d.ingredientAssertionURI?.includes(label) &&
                        d.ingredientAssertionURI?.includes('c2pa.ingredient')
                      );
                      const p1V3_delta = p1Delta?.validationDeltas?.failure || [];

                      // AGGREGATE: Did ANY layer in the sub-manifest chain fail Trust in Pass 1?
                      const hasTrustError = 
                        p1V3_delta.some(isTrustError) || 
                        p1V2_ing.some(isTrustError) || 
                        p1V2_sub.some(isTrustError) || 
                        p1V3_sub.some(isTrustError);

                      if (isFinalTrusted) {
                        // If the Root is trusted, the chain is intact. 
                        // It only earns 'Official' if it explicitly cleared the local error gauntlet.
                        ingredient.trust_source = hasTrustError ? 'legacy' : 'official';
                      }
                    }
                  });
                }
              });

            } else {
              legacyReader.free();
              
              // Fallback: If root is Trusted, entire tree is official.
              const isTrusted = finalStore.validation_state === 'Trusted';
              (Object.entries(finalStore.manifests || {}) as Array<[string, TrustedManifest]>).forEach(([label, manifest]) => {
                if (label === finalStore.active_manifest) {
                  manifest.trust_source = isTrusted ? 'official' : 'none';
                }

                if (manifest.ingredients) {
                  manifest.ingredients.forEach((ing) => {
                    ing.trust_source = (isTrusted && ing.active_manifest) ? 'official' : 'none';
                  });
                }
              });
            }
          }
        } else {
          // Pass 1 had no trust issues (Could be Trusted or Hard Invalid)
          const isTrusted = finalStore.validation_state === 'Trusted';
          (Object.entries(finalStore.manifests || {}) as Array<[string, TrustedManifest]>).forEach(([label, manifest]) => {
            if (label === finalStore.active_manifest) {
              manifest.trust_source = isTrusted ? 'official' : 'none';
            }

            if (manifest.ingredients) {
              manifest.ingredients.forEach((ing) => {
                ing.trust_source = (isTrusted && ing.active_manifest) ? 'official' : 'none';
              });
            }
          });
        }

        const { assetMap, dispose: assetMapDisposer } =
          await resultToAssetMap({ manifestStore: finalStore, source });
  
        dispose = () => {
          assetMapDisposer();
          currentReader.free();
        };

        set({
          state: 'success',
          assetMap,
          data: finalStore,
        });
      } catch (e: unknown) {
        const errStr = String(e);
        const errName = (e as Record<string, unknown>)?.name;

        if (errName === 'InvalidMimeTypeError' || errStr.includes('Unsupported format')) {
          toast.trigger(unsupportedFileType());
        } else if (
          (errName === 'C2pa(PrereleaseError)' || errStr.includes('Prerelease')) &&
          typeof source !== 'string' &&
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
