// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type {
  Ingredient,
  Manifest,
  ManifestStore,
  ResourceRef as Thumbnail,
} from '@contentauth/c2pa-web';
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
    manifestStore?.validation_results?.activeManifest;

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
    const thumbnail = await loadThumbnail(
      source.type,
      undefined,
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

    let thumbnail = await loadThumbnail(
      manifest.thumbnail?.format,
      undefined
    );

    if (
      !thumbnail.info &&
      ['valid', 'unrecognized'].includes(rootValidationResult.statusCode) &&
      (await isBrowserViewable(source.type))
    ) {
      thumbnail = await loadThumbnail(source.type, undefined);
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
    const ingredientManifestLabel = ingredient.active_manifest;
    const ingredientManifest = ingredientManifestLabel ? manifestStore.manifests?.[ingredientManifestLabel] : null;

    const thumbnail = await loadThumbnail(
      ingredient.thumbnail?.format,
      undefined,
    );

    const activeManifestValidationResults =
      ingredient.validation_results?.activeManifest;

    let validationResult = selectValidationResult(
      ingredient.validation_status || [],
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

    function formattedGeneratorInfo(claim_generator: any) {
      const version = claim_generator?.version;
      claim_generator.version = version?.replace(/\([^()]*\)/g, '');
      return claim_generator;
    }

    const claimGeneratorInfo = manifest?.claim_generator_info?.[0]
      ? formattedGeneratorInfo(manifest.claim_generator_info[0])
      : null;

    const claimGeneratorLabel =
      selectAppOrDeviceUsed(manifest) ??
      (claimGeneratorInfo?.name
        ? `${claimGeneratorInfo.name} ${claimGeneratorInfo?.version ?? ''}`
        : (selectAppOrDeviceUsed(manifest) ?? 'Unknown Generator'));

    const claimGenerator: ClaimGeneratorDisplayInfo = {
      label: claimGeneratorLabel,
      icon: claimGeneratorInfo?.icon ?? null,
    };

    const safeSignatureInfo = manifest.signature_info ? { ...manifest.signature_info } : null;
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
          const actionsAssertion = manifest.assertions?.['c2pa.actions'];
          const hasInference =
            !!(actionsAssertion as any)?.data?.metadata?.['com.adobe.inference'];

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
