// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type {
  AssetType,
  Ingredient,
  Manifest,
} from '@contentauth/c2pa-web';

type GenSoftwareAgent = string | { name: string; version?: string };

interface SdkGenerativeInfo {
  softwareAgent: GenSoftwareAgent;
  type: string;
}

type GenActionItem = {
  label?: string;
  action?: string;
  digitalSourceType?: string;
  softwareAgent?: GenSoftwareAgent;
  parameters?: { digitalSourceType?: string };
};

type GenActionsAssertion = { data?: { actions?: GenActionItem[] } };

function sdkSelectGenerativeInfo(manifest: Manifest): SdkGenerativeInfo[] {
  // Handle both native SDK array structures and crJSON maps
  const assertions = manifest.assertions;
  let actionsAssertion: unknown;

  if (Array.isArray(assertions)) {
    actionsAssertion = assertions.find(
      (a): a is { label: string; data: unknown } =>
        typeof a === 'object' &&
        a !== null &&
        'label' in a &&
        typeof (a as Record<string, unknown>)['label'] === 'string' &&
        ['c2pa.actions', 'c2pa.actions.v2'].includes((a as Record<string, unknown>)['label'] as string)
    );
  } else if (assertions && typeof assertions === 'object') {
    actionsAssertion =
      (assertions as Record<string, unknown>)['c2pa.actions.v2'] ||
      (assertions as Record<string, unknown>)['c2pa.actions'];
  }

  const actions = (actionsAssertion as GenActionsAssertion)?.data?.actions || [];

  return actions
    .filter((a) => {
      // For created/edited actions, inspect the IPTC digitalSourceType for AI definitions
      const sourceType = a.digitalSourceType || a.parameters?.digitalSourceType || '';

      return sourceType.toLowerCase().includes('algorithmicmedia');
    })
    .map((a) => {
      const rawType = a.digitalSourceType || a.parameters?.digitalSourceType;
      // The UI expects the IPTC slug, not the full absolute URI
      const typeSlug = typeof rawType === 'string' ? (rawType.split('/').pop() ?? 'legacy') : 'legacy';

      return {
        softwareAgent: a.softwareAgent || 'Unknown',
        type: typeSlug
      };
    });
}

import startsWith from 'lodash/startsWith';

type SoftwareAgent = GenSoftwareAgent;

export interface GenerativeInfo {
  softwareAgents: SoftwareAgent[];
  type: SdkGenerativeInfo['type'];
  customModels: CustomModel[];
}

export interface CustomModel {
  name: string;
  dataTypes: AssetType[];
}

export function selectGenerativeSoftwareAgents(
  generativeInfo: SdkGenerativeInfo[],
): SoftwareAgent[] {
  const softwareAgents = generativeInfo.map((assertion) => {
    return assertion?.softwareAgent;
  });

  const valid = softwareAgents.filter((x): x is SoftwareAgent => {
    if (x == null) return false;
    if (typeof x === 'string') return !!x;

    return !!x.name;
  });

  const seen = new Set<string>();

  return valid.filter((x) => {
    const key = typeof x === 'string' ? x : x.name;
    if (seen.has(key)) return false;
    seen.add(key);

    return true;
  });
}

export function selectGenerativeType(generativeInfo: SdkGenerativeInfo[]) {
  const result =
    // Try to see if we have any composite assertions
    generativeInfo.find(
      (assertion) => assertion.type === 'compositeWithTrainedAlgorithmicMedia',
      // If not, fall back to whichever one the first item is, which should be the trained or legacy assertion
    ) ?? generativeInfo[0];

  return result?.type ?? null;
}

export function selectModelsFromIngredient(ingredient: Ingredient) {
  const dataTypes = ingredient.data_types || (ingredient as { dataTypes?: AssetType[] }).dataTypes;
  if (!dataTypes || !Array.isArray(dataTypes)) return [];

  return dataTypes.filter((dataType: { type: string }) =>
    startsWith('c2pa.types.model', dataType.type),
  );
}

export function selectCustomModels(manifest: Manifest): CustomModel[] {
  return (manifest.ingredients || []).reduce<CustomModel[]>((acc, ingredient) => {
    const dataTypes = selectModelsFromIngredient(ingredient);

    if (dataTypes.length > 0) {
      return [...acc, { name: ingredient.title, dataTypes } as CustomModel];
    }

    return acc;
  }, []);
}

export function selectGenerativeInfo(manifest: Manifest) {
  const generativeInfo = sdkSelectGenerativeInfo(manifest);

  if (!generativeInfo || generativeInfo?.length === 0) {
    return null;
  }

  return {
    softwareAgents: selectGenerativeSoftwareAgents(generativeInfo),
    type: selectGenerativeType(generativeInfo),
    customModels: selectCustomModels(manifest),
  } as GenerativeInfo;
}
