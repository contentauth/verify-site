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

import { legacyToCrJson, type CrJson } from '$lib/crjson';

// Helper to extract all manifest labels that failed trust validation in a given crJSON store
function getUntrustedManifestLabels(store: CrJson): Set<string> {
  const untrustedLabels = new Set<string>();
  const isTrustError = (s: any) => s.code.includes('signingCredential');

  // 1. Check Root
  const rootFailures = store.validationResults?.activeManifest?.failure || [];
  const activeLabel = store.manifests[0]?.label;
  if (activeLabel && rootFailures.some(isTrustError)) {
    untrustedLabels.add(activeLabel);
  }

  // 2. Check EVERY manifest in the store (Active + Ingredients)
  for (const manifest of store.manifests) {
    // Check the manifest object itself
    const mFailures = manifest.validationResults?.failure || [];
    const mStatuses = manifest.validationStatus || [];
    if (mFailures.some(isTrustError) || mStatuses.some(isTrustError)) {
      untrustedLabels.add(manifest.label);
    }
  }

  return untrustedLabels;
}

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

        // PASS 1: Validate against Official Trust List
        const officialSettings = await getOfficialToolkitSettings();
        let reader = await sdk.reader.fromBlob(source.type || 'application/octet-stream', source, officialSettings);

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
          const legacyStore = await legacyReader.manifestStore();

          // 3. ONLY ADOPT Pass 2 if it actually solved the problem (State is now Trusted/Valid)
          if (legacyStore.validation_state === 'Trusted' || legacyStore.validation_state === 'Valid') {
            finalStore = legacyStore;
            
            reader.free();
            currentReader = legacyReader;

            const isTrustError = (s: any) => s.code.includes('signingCredential.untrusted') || s.code.includes('signingCredential.invalid');
            const isCryptoValid = (s: any) => s.code.includes('signingCredential.trusted') || s.code.includes('claimSignature.validated');

            // 4a. Tag the Active Manifest
            const p1ActiveV3 = rawManifestStore.validation_results?.activeManifest?.failure || [];
            const p1ActiveV2 = rawManifestStore.manifests?.[rawManifestStore.active_manifest || '']?.validation_status || [];
            const wasActiveUntrusted = p1ActiveV3.some(isTrustError) || p1ActiveV2.some(isTrustError);
            const isFinalTrusted = finalStore.validation_state === 'Trusted';
            
            if (finalStore.manifests && finalStore.active_manifest && finalStore.manifests[finalStore.active_manifest]) {
              const activeMan = finalStore.manifests[finalStore.active_manifest];
              
              // If the root is Trusted, default to official, then downgrade if Pass 1 failed.
              if (isFinalTrusted) {
                activeMan.trust_source = wasActiveUntrusted ? 'legacy' : 'official';
              } else {
                activeMan.trust_source = 'none';
              }
            }

            // 4b. Tag ALL Ingredients across the entire provenance tree
            const p1Deltas = rawManifestStore.validation_results?.ingredientDeltas || [];
            
            Object.entries(finalStore.manifests || {}).forEach(([label, manifest]: [string, any]) => {
              const p1Manifest = rawManifestStore.manifests?.[label];
              
              if (manifest.ingredients && p1Manifest?.ingredients) {
                manifest.ingredients.forEach((ingredient: any, index: number) => {
                  // ZERO TRUST DEFAULT: Unverified assets get no trust credentials
                  ingredient.trust_source = 'none';

                  if (ingredient.active_manifest) {
                    const p1Ing = p1Manifest.ingredients[index];
                    const subLabel = ingredient.active_manifest;
                    const p1SubManifest = subLabel ? rawManifestStore.manifests?.[subLabel] : null;

                    // 1. Check the Ingredient Pointer (V2 standard)
                    const p1V2_ing = p1Ing?.validation_status || [];

                    // 2. Check the actual Sub-Manifest directly (V2 + V3 standards)
                    // NOTE: In V3, the sub-manifest's own results are stored under .activeManifest
                    const p1V2_sub = p1SubManifest?.validation_status || [];
                    const p1V3_sub = p1SubManifest?.validation_results?.activeManifest?.failure || [];

                    // 3. Check the Root Deltas (V3 standard)
                    const p1Delta = p1Deltas.find((d: any) => 
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
            Object.entries(finalStore.manifests || {}).forEach(([label, manifest]: [string, any]) => {
              if (label === finalStore.active_manifest) {
                manifest.trust_source = isTrusted ? 'official' : 'none';
              }
              if (manifest.ingredients) {
                manifest.ingredients.forEach((ing: any) => {
                  ing.trust_source = (isTrusted && ing.active_manifest) ? 'official' : 'none';
                });
              }
            });
          }
        } else {
          // Pass 1 had no trust issues (Could be Trusted or Hard Invalid)
          const isTrusted = finalStore.validation_state === 'Trusted';
          Object.entries(finalStore.manifests || {}).forEach(([label, manifest]: [string, any]) => {
            if (label === finalStore.active_manifest) {
              manifest.trust_source = isTrusted ? 'official' : 'none';
            }
            if (manifest.ingredients) {
              manifest.ingredients.forEach((ing: any) => {
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
