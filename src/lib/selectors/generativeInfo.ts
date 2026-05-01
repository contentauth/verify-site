// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { AssetType, Ingredient, Manifest } from '@contentauth/c2pa-web';

interface SdkGenerativeInfo {
  softwareAgent: string;
  type: string;
}

type GenActionItem = {
  label?: string;
  action?: string;
  digitalSourceType?: string;
  softwareAgent?: string;
  parameters?: { digitalSourceType?: string };
};

type GenActionsAssertion = { data?: { actions?: GenActionItem[] } };

function sdkSelectGenerativeInfo(manifest: Manifest): SdkGenerativeInfo[] {
  // Handle native SDK array structure (assertions is always ManifestAssertion[])
  const assertions = Array.isArray(manifest.assertions)
    ? manifest.assertions
    : [];
  const actionsAssertion = assertions.find(
    (a: { label?: string }) =>
      a.label === 'c2pa.actions' || a.label === 'c2pa.actions.v2',
  );

  const actions =
    (actionsAssertion as GenActionsAssertion)?.data?.actions || [];

  return actions
    .filter((a) => {
      // For created/edited actions, inspect the IPTC digitalSourceType for AI definitions
      const sourceType =
        a.digitalSourceType || a.parameters?.digitalSourceType || '';

      return sourceType.toLowerCase().includes('algorithmicmedia');
    })
    .map((a) => {
      const rawType = a.digitalSourceType || a.parameters?.digitalSourceType;
      // The UI expects the IPTC slug, not the full absolute URI
      const typeSlug =
        typeof rawType === 'string'
          ? (rawType.split('/').pop() ?? 'legacy')
          : 'legacy';

      return {
        softwareAgent: a.softwareAgent || 'Unknown',
        type: typeSlug,
      };
    });
}

import { filter, flow, uniqBy } from 'lodash/fp';
import startsWith from 'lodash/startsWith';

export type SoftwareAgent = string | { name: string; version?: string };

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
  const softwareAgents: string[] = generativeInfo.map((assertion) => {
    return assertion?.softwareAgent;
  });

  // if there are undefined software agents remove them from the array
  return flow<[string[]], string[], string[]>(
    filter((x: string) => !!x),
    uniqBy((x: string) => x),
  )(softwareAgents) as SoftwareAgent[];
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
  return (
    ingredient.data_types?.filter((dataType: { type: string }) =>
      startsWith('c2pa.types.model', dataType.type),
    ) ?? []
  );
}

export function selectCustomModels(manifest: Manifest): CustomModel[] {
  return (manifest.ingredients || []).reduce<CustomModel[]>(
    (acc, ingredient) => {
      const dataTypes = selectModelsFromIngredient(ingredient);

      if (dataTypes.length > 0) {
        return [...acc, { name: ingredient.title, dataTypes } as CustomModel];
      }

      return acc;
    },
    [],
  );
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
