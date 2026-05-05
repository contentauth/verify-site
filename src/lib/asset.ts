// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type {
  Ingredient,
  Manifest,
  ManifestStore,
  ResourceRef as Thumbnail,
  StatusCodes,
} from '@contentauth/c2pa-web';
import { type ValidationStatus } from './selectors/validationResult';

interface ExtendedIngredient extends Ingredient {
  activeManifest?: string;
  validationStatus?: ValidationStatus[];
  validationResults?: { activeManifest?: StatusCodes };
  trustSource?: string;
}
import { selectDoNotTrain } from './selectors/doNotTrain';
import { selectEditsAndActivity, type TranslatedDictionaryCategory } from './selectors/editsAndActivity';
import { selectProducer } from './selectors/producer';
import { selectSocialAccounts } from './selectors/socialAccounts';
import debug from 'debug';
import { selectExif } from './exif';
import {
  MEDIA_CATEGORIES,
  SUPPORTED_FORMATS,
  isBrowserViewable,
  type MediaCategory,
} from './formats';
import { DEFAULT_LOCALE } from './i18n';
import { selectAppOrDeviceUsed } from './selectors/appOrDeviceUsed';
import { selectAutoDubInfo, type AutoDubInfo } from './selectors/autoDubInfo';
import {
  selectGenerativeInfo,
  selectModelsFromIngredient,
  type GenerativeInfo,
} from './selectors/generativeInfo';
import { selectReviewRatings } from './selectors/reviewRatings';
import {
  selectValidationResult,
  validationStatusByManifestLabel,
  type ManifestLabelValidationStatusMap,
  type ValidationStatusResult,
} from './selectors/validationResult';
import { selectWeb3 } from './selectors/web3Info';
import { selectWebsite } from './selectors/website';
import { loadThumbnail, type ThumbnailInfo } from './thumbnail';
import type { Disposable } from './types';

const MANIFEST_STORE_MIME_TYPE = 'application/x-c2pa-manifest-store';
const dbg = debug('lib:asset');

/**
 * Asset data required for the verify UI.
 */
export type AssetData = {
  id: string;
  children: string[];
  manifestData: ManifestData | null;
  thumbnail: ThumbnailInfo | null;
  mimeType: string;
  title: string | null;
  dataType: 'model' | null;
  validationResult: ValidationStatusResult | null;
  trustSource: 'official' | 'legacy' | 'none';
};

interface EditsAndActivityInferenceResponse {
  editsAndActivity: TranslatedDictionaryCategory[];
  hasInference: boolean;
}

export interface ClaimGeneratorDisplayInfo {
  label: string;
  icon: Thumbnail | null;
}

export type ManifestData = {
  claimGenerator: ClaimGeneratorDisplayInfo;
  date: Date | null;
  editsAndActivityForLocale: (
    locale: string | null,
  ) => Promise<EditsAndActivityInferenceResponse | null>;
  exif: ReturnType<typeof selectExif>;
  label: string | null;
  generativeInfo: GenerativeInfo | null;
  producer: string | null;
  reviewRatings: ReturnType<typeof selectReviewRatings>;
  signatureInfo: Manifest['signature_info'];
  doNotTrain: ReturnType<typeof selectDoNotTrain>;
  socialAccounts: ReturnType<typeof selectSocialAccounts>;
  web3Accounts: [string, string[]][];
  website: string | null;
  autoDubInfo: AutoDubInfo | null;
  isCapturedMedia: boolean;
};

export type AssetDataMap = Record<string, AssetData>;

export type DisposableAssetDataMap = Disposable<{
  // Flattened map of asset data, keyed by asset ID
  assetMap: AssetDataMap;
}>;

export const ROOT_ID = '0';

export function getMediaCategoryFromMimeType(mimeType: string): MediaCategory {
  const prefix = mimeType?.split('/')[0] as MediaCategory;

  return (
    SUPPORTED_FORMATS[mimeType]?.category ??
    (MEDIA_CATEGORIES.includes(prefix) ? prefix : 'unknown')
  );
}

export function getIngredientDataType(
  ingredient: Ingredient,
): AssetData['dataType'] {
  // Check if model
  if (selectModelsFromIngredient(ingredient).length > 0) {
    return 'model';
  }

  return null;
}

/**
 *
 * @param result Result from C2PA SDK
 * @returns Object containing a flattened map of asset data (keyed by asset ID), along with a disposer
 *
 * This will recursively process all nodes in the provenance tree, adding to (mutating) the `assetStore`
 * as the nodes are traversed. It also returns a disposer that should be called when this asset
 */
export async function resultToAssetMap({
  manifestStore,
  source,
}: {
  manifestStore: ManifestStore;
  source: Blob | File;
}): Promise<DisposableAssetDataMap> {
  const assetMap: AssetDataMap = {};
  const disposers: (() => void)[] = [];
  
  const activeManifestLabel = manifestStore?.active_manifest ?? '';

  const allLabels = Object.keys(manifestStore?.manifests ?? {});
  const runtimeValidationStatuses = manifestStore?.validation_status
    ? validationStatusByManifestLabel(
        manifestStore?.validation_status,
        allLabels,
        activeManifestLabel,
      )
    : {};

  dbg('Runtime validation statuses by manifest label', runtimeValidationStatuses);

  const activeManifestValidationResults =
    manifestStore?.validation_results?.activeManifest || undefined;

  const rootValidationStatuses =
    runtimeValidationStatuses[activeManifestLabel] ?? [];
  const rootValidationResult = selectValidationResult(
    rootValidationStatuses,
    activeManifestValidationResults,
  );
  const { hasError, hasOtgp } = rootValidationResult ?? {};
  const isManifest = source.type === MANIFEST_STORE_MIME_TYPE;
  const id = ROOT_ID;

  dbg('resultToAssetMap input:', {
    manifestStore,
    source,
    rootValidationResult,
  });

  function dispose() {
    while (disposers.length) {
      disposers.pop()?.();
    }
  }

  if (!isManifest && (!manifestStore || hasError || hasOtgp)) {
    // Fallback for raw files: render the original source file directly
    const url = URL.createObjectURL(source);
    const thumbnail = await loadThumbnail(
      source.type,
      { url, dispose: () => URL.revokeObjectURL(url) },
    );

    if (thumbnail?.dispose) {
      disposers.push(thumbnail.dispose);
    }

    assetMap[id] = {
      id,
      title: (source as File).name ?? null,
      thumbnail: thumbnail.info,
      mimeType: source.type,
      children: [],
      manifestData: null,
      dataType: null,
      validationResult: rootValidationResult,
      trustSource: 'none',
    };

    if (!manifestStore || hasError) {
      return {
        assetMap,
        dispose,
      };
    }
  }

  if (manifestStore && hasOtgp) {
    await manifestStoreToAssetData(
      manifestStore,
      selectValidationResult([]),
      runtimeValidationStatuses,
      id,
    );
  } else if (manifestStore && rootValidationResult) {
    await manifestStoreToAssetData(
      manifestStore,
      rootValidationResult,
      runtimeValidationStatuses,
      id,
    );
  }

  async function manifestStoreToAssetData(
    manifestStore: ManifestStore,
    rootValidationResult: ValidationStatusResult,
    runtimeValidationStatuses: ManifestLabelValidationStatusMap,
    id: string,
  ): Promise<AssetData> {
    const manifest = manifestStore.manifests?.[manifestStore.active_manifest || ''];
    if (!manifest) throw new Error('Active manifest not found');

    // 0.17.x SDK dropped internal thumbnail generation. Pass undefined to skip WASM fetch.
    let thumbnail = await loadThumbnail(
      manifest.thumbnail?.format,
      undefined
    );

    if (
      !thumbnail.info &&
      ['valid', 'unrecognized'].includes(rootValidationResult.statusCode) &&
      (await isBrowserViewable(source.type))
    ) {
      // Fallback for active manifest: render the original source file directly
      const url = URL.createObjectURL(source);
      thumbnail = await loadThumbnail(
        source.type, 
        { url, dispose: () => URL.revokeObjectURL(url) }
      );
    }

    const asset = {
      id,
      title: manifest.title ?? null,
      thumbnail: thumbnail.info,
      mimeType: manifest.format || source.type,
      children: await processIngredients(
        manifest.ingredients || [],
        manifestStore,
        runtimeValidationStatuses,
        id,
      ),
      manifestData: await getManifestData(manifest, rootValidationResult),
      dataType: null,
      validationResult: rootValidationResult,
      trustSource: ((manifest as Manifest & { trust_source?: string }).trust_source || 'none') as 'legacy' | 'none' | 'official',
    };

    if (thumbnail?.dispose) {
      disposers.push(thumbnail.dispose);
    }

    assetMap[id] = asset;

    return asset;
  }

  async function ingredientToAssetData(
    ingredient: Ingredient,
    manifestStore: ManifestStore,
    runtimeValidationStatuses: ManifestLabelValidationStatusMap,
    id: string,
  ): Promise<AssetData> {
    const ingredientManifestLabel = ingredient.active_manifest || (ingredient as ExtendedIngredient).activeManifest;
    const ingredientManifest = ingredientManifestLabel ? manifestStore.manifests?.[ingredientManifestLabel] : null;

    

    // 0.17.x SDK dropped internal thumbnail generation. Skip WASM fetch for ingredients.
    const thumbnail = await loadThumbnail(
      ingredient.thumbnail?.format,
      undefined,
    );

    const activeManifestValidationResults =
      (ingredient.validation_results?.activeManifest || (ingredient as ExtendedIngredient).validationResults?.activeManifest) ?? undefined;

    const validationStatus = ingredient.validation_status || (ingredient as ExtendedIngredient).validationStatus || [];
    let validationResult = selectValidationResult(
      validationStatus,
      activeManifestValidationResults,
    );

    if (!validationResult.hasError && ingredientManifestLabel) {
      validationResult = selectValidationResult(
        runtimeValidationStatuses[ingredientManifestLabel] ?? [],
      );
    }

    const showChildren = validationResult.statusCode !== 'invalid';
    const asset = {
      id,
      title: ingredient.title ?? null,
      thumbnail: thumbnail.info,
      mimeType: ingredient.format || '',
      children: (showChildren && ingredientManifest?.ingredients)
        ? await processIngredients(
            ingredientManifest.ingredients,
            manifestStore,
            runtimeValidationStatuses,
            id,
          )
        : [],
      manifestData: await getManifestData(ingredientManifest, validationResult),
      dataType: getIngredientDataType(ingredient),
      validationResult,
      trustSource: ((ingredient as ExtendedIngredient)?.trust_source || (ingredient as ExtendedIngredient)?.trustSource || 'none') as 'legacy' | 'none' | 'official',
    };

    if (thumbnail?.dispose) {
      disposers.push(thumbnail.dispose);
    }

    assetMap[id] = asset;

    return asset;
  }

  async function getManifestData(
    manifest: Manifest | null | undefined,
    validationResult: ValidationStatusResult
  ): Promise<ManifestData | null> {
    if (!manifest) {
      return null;
    }

    interface GeneratorInfoShape {
      name?: string;
      version?: string | null;
      icon?: string | null;
    }

    function formattedGeneratorInfo(claim_generator: GeneratorInfoShape) {
      const cloned = { ...claim_generator };
      const version = cloned?.version;
      cloned.version = version ? version.replace(/\([^()]*\)/g, '') : null;

      return cloned;
    }

    const claimGeneratorInfo = manifest?.claim_generator_info?.[0]
      ? formattedGeneratorInfo(manifest.claim_generator_info[0] as GeneratorInfoShape)
      : null;

    const claimGeneratorLabel =
      selectAppOrDeviceUsed(manifest) ??
      (claimGeneratorInfo?.name
        ? `${claimGeneratorInfo.name} ${claimGeneratorInfo?.version ?? ''}`
        : (selectAppOrDeviceUsed(manifest) ?? 'Unknown Generator'));

    const claimGenerator: ClaimGeneratorDisplayInfo = {
      label: claimGeneratorLabel,
      icon: (claimGeneratorInfo?.icon ? { identifier: claimGeneratorInfo.icon } : null) as unknown as Thumbnail | null,
    };

    // Extract Organization (O) from the native X.509 certificate subject tree
    const safeSignatureInfo = manifest.signature_info
      ? { ...manifest.signature_info }
      : null;

    if (safeSignatureInfo && validationResult.hasUntrustedTimestamp) {
      safeSignatureInfo.time = undefined;
    }

    return {
      date: safeSignatureInfo?.time
        ? new Date(safeSignatureInfo.time)
        : null,
      claimGenerator,
      signatureInfo: safeSignatureInfo,
      producer: selectProducer(manifest)?.name ?? null,
      editsAndActivityForLocale: async (locale) => {
        const editsAndActivity = await selectEditsAndActivity(
          manifest,
          locale ?? DEFAULT_LOCALE,
        );

        if (editsAndActivity) {
          interface InferenceAssertion {
            data?: {
              metadata?: {
                'com.adobe.inference'?: unknown;
              };
            };
          }
          const assertionsArr = (manifest.assertions || []) as unknown[];
          type AssItem = { label?: string; data?: unknown };
          const actionsAss = assertionsArr.find((a: unknown) => (a as AssItem).label === 'c2pa.actions' || (a as AssItem).label === 'c2pa.actions.v2') as InferenceAssertion | undefined;
          const hasInference = !!actionsAss?.data?.metadata?.['com.adobe.inference'];

          const filteredEditsAndActivity = editsAndActivity.filter(
            (value) => !!value.label,
          );

          return {
            editsAndActivity: filteredEditsAndActivity,
            hasInference,
          };
        }

        return null;
      },
      socialAccounts: selectSocialAccounts(manifest),
      generativeInfo: selectGenerativeInfo(manifest),
      exif: selectExif(manifest),
      label: manifest.label ?? null,
      doNotTrain: selectDoNotTrain(manifest),
      reviewRatings: selectReviewRatings(manifest),
      web3Accounts: selectWeb3(manifest),
      website: selectWebsite(manifest),
      autoDubInfo: selectAutoDubInfo(manifest),
      isCapturedMedia: (() => {
        // 1. Must be a still image or audio file (Fallback to assuming true if SDK omits format)
        const format = manifest.format || 'image/jpeg';
        if (!format.startsWith('image/') && !format.startsWith('audio/')) return false;

        // 2. Must have exactly one action in the manifest history
        let actionsAssertion;

        if (manifest.assertions instanceof Map) {
          actionsAssertion = manifest.assertions.get('c2pa.actions.v2')?.[0] || manifest.assertions.get('c2pa.actions')?.[0] || manifest.assertions.get('c2pa.actions.v2') || manifest.assertions.get('c2pa.actions');
        } else if (Array.isArray(manifest.assertions)) {
          actionsAssertion = manifest.assertions.find((a: unknown) => (a as { label?: string }).label === 'c2pa.actions.v2' || (a as { label?: string }).label === 'c2pa.actions');
        } else {
          actionsAssertion = manifest.assertions?.['c2pa.actions.v2'] || manifest.assertions?.['c2pa.actions'];
        }

        type ActionEntry = { action: string; digitalSourceType?: string; parameters?: { digitalSourceType?: string } };
        type AssertionBlock = { data?: { actions?: ActionEntry[] }; actions?: ActionEntry[] };
        const actions = (actionsAssertion as AssertionBlock)?.data?.actions || (actionsAssertion as AssertionBlock)?.actions || [];
        if (actions.length !== 1) return false;

        // 3. First and only action must be c2pa.created
        const action = actions[0];
        if (action.action !== 'c2pa.created') return false;

        // 4. Digital source type must be a standard captured media URI (including computational)
        const sourceType = action.digitalSourceType || action.parameters?.digitalSourceType || '';

        return sourceType.includes('digitalCapture') || sourceType.includes('compositeCapture') || sourceType.includes('computationalCapture');
      })(),
    };
  }

  async function processIngredients(
    ingredients: Ingredient[],
    manifestStore: ManifestStore,
    runtimeValidationStatuses: ManifestLabelValidationStatusMap,
    id: string,
  ): Promise<string[]> {
    const ingredientIds = ingredients.map(async (ingredient, idx) => {
      const ingredientId = `${id}.${idx}`;

      await ingredientToAssetData(
        ingredient,
        manifestStore,
        runtimeValidationStatuses,
        ingredientId,
      );

      return ingredientId;
    });

    return Promise.all(ingredientIds);
  }

  dbg('resultToAssetMap result:', {
    assetMap,
    activeManifestData: assetMap[ROOT_ID]?.manifestData,
  });

  return {
    assetMap,
    dispose,
  };
}
