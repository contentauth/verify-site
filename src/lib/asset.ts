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

import {
  selectEditsAndActivity,
  selectFormattedGenerator,
  selectProducer,
  selectSocialAccounts,
  type C2paReadResult,
  type Ingredient,
  type Manifest,
  type ManifestStore,
  type TranslatedDictionaryCategory,
} from 'c2pa';
import debug from 'debug';
import { selectExif } from './exif';
import {
  MEDIA_CATEGORIES,
  SUPPORTED_FORMATS,
  isBrowserViewable,
  type MediaCategory,
} from './formats';
import { DEFAULT_LOCALE } from './i18n';
import { MANIFEST_STORE_MIME_TYPE } from './manifestRecovery';
import { selectDoNotTrain } from './selectors/doNotTrain';
import {
  selectGenerativeInfo,
  type GenerativeInfo,
} from './selectors/generativeInfo';
import { selectReviewRatings } from './selectors/reviewRatings';
import {
  selectValidationResult,
  type ValidationStatusResult,
} from './selectors/validationResult';
import { selectWeb3 } from './selectors/web3Info';
import { selectWebsite } from './selectors/website';
import { loadThumbnail, type ThumbnailInfo } from './thumbnail';
import type { Disposable } from './types';

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
  validationResult: ValidationStatusResult | null;
};

interface EditsAndActivityInferenceResponse {
  editsAndActivity: TranslatedDictionaryCategory[];
  hasInference: boolean;
}

export type ManifestData = {
  claimGenerator: string;
  date: Date | null;
  editsAndActivityForLocale: (
    locale: string | null,
  ) => Promise<EditsAndActivityInferenceResponse | null>;
  exif: ReturnType<typeof selectExif>;
  generativeInfo: GenerativeInfo | null;
  producer: string | null;
  reviewRatings: ReturnType<typeof selectReviewRatings>;
  signatureInfo: Manifest['signatureInfo'];
  doNotTrain: ReturnType<typeof selectDoNotTrain>;
  socialAccounts: ReturnType<typeof selectSocialAccounts>;
  web3Accounts: [string, string[]][];
  website: string | null;
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
}: C2paReadResult): Promise<DisposableAssetDataMap> {
  const assetMap: AssetDataMap = {};
  const disposers: (() => void)[] = [];
  const rootValidationResult = manifestStore?.validationStatus
    ? selectValidationResult(manifestStore?.validationStatus)
    : null;
  const { hasError, hasOtgp } = rootValidationResult ?? {};
  const isManifest = source.blob?.type === MANIFEST_STORE_MIME_TYPE;
  let id = ROOT_ID;

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
      source.thumbnail.getUrl(),
    );
    const children = hasOtgp ? ['0.0'] : [];

    if (thumbnail?.dispose) {
      disposers.push(thumbnail.dispose);
    }

    assetMap[id] = {
      // @TODO filename if none present?
      id,
      title: source.metadata.filename ?? null,
      thumbnail: thumbnail.info,
      mimeType: source.type,
      children,
      manifestData: null,
      validationResult: rootValidationResult,
    };

    // Return early if we don't have a manifestStore
    if (!manifestStore || hasError) {
      return {
        assetMap,
        dispose,
      };
    }

    // If we are not returning early, increment the ID
    id = children[0];
  }

  // Start processing the provenance tree
  if (manifestStore && hasOtgp) {
    // Since the OTGP status is on the source, we don't show any issues on the asset underneath
    await manifestStoreToAssetData(
      manifestStore,
      selectValidationResult([]),
      id,
    );
  } else if (manifestStore && rootValidationResult) {
    // This conditional should always resolve to `true`, it's more to help TypeScript out
    await manifestStoreToAssetData(manifestStore, rootValidationResult, id);
  }

  // Convert a manifest to an asset usable by the verify UI and add it to the map
  // Any processing here should be specific to keys on the root manifest
  async function manifestStoreToAssetData(
    manifestStore: ManifestStore,
    validationResult: ValidationStatusResult,
    id: string,
  ): Promise<AssetData> {
    const { activeManifest: manifest } = manifestStore;

    // Attempt to use a thumbnail on the manifest if found
    let thumbnail = await loadThumbnail(
      manifest.thumbnail?.contentType,
      manifest.thumbnail?.getUrl(),
    );

    // If no thumbnail exists on the claim and we have a valid manifest,
    // we can use the source thumbnail if it is viewable by the browser
    if (
      !thumbnail.info &&
      validationResult.statusCode === 'valid' &&
      (await isBrowserViewable(source.type))
    ) {
      thumbnail = await loadThumbnail(source.type, source.thumbnail?.getUrl());
    }

    const asset = {
      id,
      title: manifest.title,
      thumbnail: thumbnail.info,
      mimeType: manifest.format,
      children: await processIngredients(manifest.ingredients, id),
      manifestData: await getManifestData(manifest),
      validationResult,
    };

    if (thumbnail?.dispose) {
      disposers.push(thumbnail.dispose);
    }

    assetMap[id] = asset;

    return asset;
  }

  // Convert an ingredient to an asset usable by the verify UI and add it to the map
  // Any processing here should be specific to keys on an ingredient
  async function ingredientToAssetData(
    ingredient: Ingredient,
    id: string,
  ): Promise<AssetData> {
    const thumbnail = await loadThumbnail(
      ingredient.thumbnail?.contentType,
      ingredient.thumbnail?.getUrl(),
    );
    const validationResult = selectValidationResult(
      ingredient.validationStatus,
    );
    const showChildren = validationResult.statusCode !== 'invalid';
    const asset = {
      id,
      title: ingredient.title,
      thumbnail: thumbnail.info,
      mimeType: ingredient.format,
      children: showChildren
        ? await processIngredients(ingredient.manifest?.ingredients ?? [], id)
        : [],
      manifestData: await getManifestData(ingredient.manifest),
      validationResult,
    };

    if (thumbnail?.dispose) {
      disposers.push(thumbnail.dispose);
    }

    assetMap[id] = asset;

    return asset;
  }

  // Get manifest data from a manifest (either a root manifest or an ingredient manifest)
  // Any processing that is common to both ingredients or active manifests should go here
  async function getManifestData(
    manifest: Manifest | null,
  ): Promise<ManifestData | null> {
    if (!manifest) {
      return null;
    }

    function formattedGeneratorInfo(
      claim_generator: Manifest['claimGeneratorInfo'][0],
    ) {
      const version = claim_generator?.version;
      claim_generator.version = version?.replace(/\([^()]*\)/g, '');

      return claim_generator;
    }

    const claimGeneratorInfo = manifest?.claimGeneratorInfo[0]
      ? formattedGeneratorInfo(manifest?.claimGeneratorInfo[0])
      : null;

    return {
      date: manifest.signatureInfo?.time
        ? new Date(manifest.signatureInfo.time)
        : null,
      claimGenerator: claimGeneratorInfo?.name
        ? `${claimGeneratorInfo.name} ${claimGeneratorInfo?.version ?? ''}`
        : selectFormattedGenerator(manifest),
      signatureInfo: manifest.signatureInfo,
      producer: selectProducer(manifest)?.name ?? null,
      editsAndActivityForLocale: async (locale) => {
        const editsAndActivity = await selectEditsAndActivity(
          manifest,
          locale ?? DEFAULT_LOCALE,
        );

        if (editsAndActivity) {
          // Add inference information
          const [actionsAssertion] = manifest.assertions.get('c2pa.actions');
          const hasInference =
            !!actionsAssertion?.data?.metadata?.['com.adobe.inference'];

          return { editsAndActivity, hasInference };
        }

        return null;
      },
      socialAccounts: selectSocialAccounts(manifest),
      generativeInfo: selectGenerativeInfo(manifest),
      exif: selectExif(manifest),
      doNotTrain: selectDoNotTrain(manifest),
      reviewRatings: selectReviewRatings(manifest),
      web3Accounts: selectWeb3(manifest),
      website: selectWebsite(manifest),
    };
  }

  async function processIngredients(
    ingredients: Ingredient[],
    id: string,
  ): Promise<string[]> {
    const ingredientIds = ingredients.map(async (ingredient, idx) => {
      const ingredientId = `${id}.${idx}`;

      await ingredientToAssetData(ingredient, ingredientId);

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
