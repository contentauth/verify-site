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
import { locale } from 'svelte-i18n';
import { get } from 'svelte/store';
import { selectExif } from './exif';
import { DEFAULT_LOCALE } from './i18n';
import { MANIFEST_STORE_MIME_TYPE } from './manifestRecovery';
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
import { formatThumbnail } from './thumbnail';
import type { Disposable } from './types';

const dbg = debug('lib:asset');

export const MEDIA_CATEGORIES = ['audio', 'image', 'video', 'unknown'] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];

export interface FormatDefinition {
  name: string;
  category: MediaCategory;
  browserViewable: () => Promise<boolean>;
  searchable: boolean;
}

export const SUPPORTED_FORMATS: Record<string, FormatDefinition> = {
  'image/jpeg': {
    name: 'JPEG',
    category: 'image',
    browserViewable: async () => true,
    searchable: true,
  },
  'image/png': {
    name: 'PNG',
    category: 'image',
    browserViewable: async () => true,
    searchable: true,
  },
  'image/svg+xml': {
    name: 'SVG',
    category: 'image',
    browserViewable: async () => true,
    searchable: false,
  },
  'image/x-adobe-dng': {
    name: 'DNG',
    category: 'image',
    browserViewable: async () => false,
    searchable: false,
  },
  'image/tiff': {
    name: 'TIFF',
    category: 'image',
    browserViewable: async () => false,
    searchable: false,
  },
  'image/webp': {
    name: 'WebP',
    category: 'image',
    browserViewable: async () => true,
    searchable: false,
  },
  'image/avif': {
    name: 'AVIF',
    category: 'image',
    browserViewable: async () =>
      testImageSupport(
        'data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZgAAAOptZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAEOAAEAAAAAAAAAFAAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAamlwcnAAAABLaXBjbwAAABNjb2xybmNseAACAAIABoAAAAAMYXYxQ4EgAgAAAAAUaXNwZQAAAAAAAAABAAAAAQAAABBwaXhpAAAAAAMICAgAAAAXaXBtYQAAAAAAAAABAAEEgYIDhAAAABxtZGF0EgAKBDgABgkyChgAAABABfXvZOg=',
      ),
    searchable: false,
  },
  'image/heic': {
    name: 'HEIC',
    category: 'image',
    browserViewable: async () =>
      testImageSupport(
        'data:image/heic;base64,AAAAGGZ0eXBoZWljAAAAAGhlaWNtaWYxAAAB4G1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAHBpY3QAAAAAAAAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAADnBpdG0AAAAAAAEAAAA4aWluZgAAAAAAAgAAABVpbmZlAgAAAAABAABodmMxAAAAABVpbmZlAgAAAQACAABFeGlmAAAAABppcmVmAAAAAAAAAA5jZHNjAAIAAQABAAABA2lwcnAAAADiaXBjbwAAABNjb2xybmNseAACAAIABoAAAAByaHZjQwEDcAAAALAAAAAAAB7wAPz9+PgAAAsDoAABABdAAQwB//8DcAAAAwCwAAADAAADAB5wJKEAAQAkQgEBA3AAAAMAsAAAAwAAAwAeoBQgQcChBBiHuRZVNwICBgCAogABAAlEAcBgwLIQFMkAAAAUaXNwZQAAAAAAAAACAAAAAgAAAChjbGFwAAAAAQAAAAEAAAABAAAAAf/AAAAAgAAA/8AAAACAAAAAAAAJaXJvdAAAAAAQcGl4aQAAAAADCAgIAAAAGWlwbWEAAAAAAAAAAQABBoGCA4SFBgAAACxpbG9jAAAAAEQAAAIAAQAAAAEAAAJgAAAAHQACAAAAAQAAAggAAABYAAAAAW1kYXQAAAAAAAAAhQAAAAZFeGlmAABNTQAqAAAACAAEARIAAwAAAAEAAQAAARoABQAAAAEAAAA+ARsABQAAAAEAAABGASgAAwAAAAEAAgAAAAAAAAAAAEgAAAABAAAASAAAAAEAAAAZKAGvolT7bB+6j/ITt/QLyKMvD2Rus1+lQA==',
      ),
    searchable: false,
  },
  'audio/mp4': {
    name: 'M4A',
    category: 'audio',
    browserViewable: async () => false,
    searchable: false,
  },
  'audio/x-wav': {
    name: 'WAV',
    category: 'audio',
    browserViewable: async () => false,
    searchable: false,
  },
  'application/mp4': {
    name: 'MP4',
    category: 'video',
    browserViewable: async () => true,
    searchable: false,
  },
  'video/mp4': {
    name: 'MP4',
    category: 'video',
    browserViewable: async () => true,
    searchable: false,
  },
};

function testImageSupport(dataUri: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = document.createElement('img');

    img.onload = () => {
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };

    img.src = dataUri;
  });
}

async function isBrowserViewable(mimeType: string) {
  const format = SUPPORTED_FORMATS[mimeType];

  if (format) {
    return format.browserViewable();
  }

  return false;
}

/**
 * Asset data required for the verify UI.
 */
export type AssetData = {
  id: string;
  children: string[];
  manifestData: ManifestData | null;
  thumbnail: string | null;
  mimeType: string;
  title: string | null;
  validationResult: ValidationStatusResult | null;
};

export type ManifestData = {
  claimGenerator: string;
  date: Date | null;
  editsAndActivity: TranslatedDictionaryCategory[] | null;
  exif: ReturnType<typeof selectExif>;
  generativeInfo: GenerativeInfo | null;
  producer: string | null;
  reviewRatings: ReturnType<typeof selectReviewRatings>;
  signatureInfo: Manifest['signatureInfo'];
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
    const thumbnail = await formatThumbnail(source.thumbnail.getUrl());
    const children = hasOtgp ? ['0.0'] : [];

    if (thumbnail?.dispose) {
      disposers.push(thumbnail.dispose);
    }

    assetMap[id] = {
      // @TODO filename if none present?
      id,
      title: source.metadata.filename ?? null,
      thumbnail: thumbnail?.url ?? null,
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
    let thumbnail = await formatThumbnail(manifest.thumbnail?.getUrl());

    // If no thumbnail exists on the claim and we have a valid manifest,
    // we can use the source thumbnail if it is viewable by the browser
    if (
      !thumbnail &&
      validationResult.statusCode === 'valid' &&
      (await isBrowserViewable(source.type))
    ) {
      thumbnail = source.thumbnail?.getUrl();
    }

    const asset = {
      id,
      title: manifest.title,
      thumbnail: thumbnail?.url ?? null,
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
    const thumbnail = await formatThumbnail(ingredient.thumbnail?.getUrl());
    const validationResult = selectValidationResult(
      ingredient.validationStatus,
    );
    const showChildren = validationResult.statusCode !== 'invalid';
    const asset = {
      id,
      title: ingredient.title,
      thumbnail: thumbnail?.url ?? null,
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

    return {
      date: manifest.signatureInfo?.time
        ? new Date(manifest.signatureInfo.time)
        : null,
      claimGenerator: selectFormattedGenerator(manifest),
      signatureInfo: manifest.signatureInfo,
      producer: selectProducer(manifest)?.name ?? null,
      editsAndActivity: await selectEditsAndActivity(
        manifest,
        get(locale) ?? DEFAULT_LOCALE,
      ),
      socialAccounts: selectSocialAccounts(manifest),
      generativeInfo: selectGenerativeInfo(manifest),
      exif: selectExif(manifest),
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
