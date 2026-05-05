// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type {
  Ingredient,
  Manifest,
} from '@contentauth/c2pa-web';

interface SdkGenerativeInfo {
  softwareAgent: string;
  type: string;
}

function sdkSelectGenerativeInfo(manifest: Manifest): SdkGenerativeInfo[] {
  // Handle both native SDK array structures and crJSON maps
  type C2paActionItem = { action: string; digitalSourceType?: string; softwareAgent?: string; parameters?: { digitalSourceType?: string } };
  type AssertionValue = { label?: string; data?: { actions?: C2paActionItem[] }; actions?: C2paActionItem[] };

  const isArray = Array.isArray(manifest.assertions);
  const assertionsArray = (manifest.assertions || []) as unknown[];
  const actionsAssertion = isArray 
    ? assertionsArray.find((a: unknown) => (a as AssertionValue).label === 'c2pa.actions' || (a as AssertionValue).label === 'c2pa.actions.v2')
    : ((manifest.assertions as unknown as Record<string, unknown>)?.[ 'c2pa.actions.v2' ] || (manifest.assertions as unknown as Record<string, unknown>)?.[ 'c2pa.actions' ]);
     
  const actions = (actionsAssertion as AssertionValue)?.data?.actions || (actionsAssertion as AssertionValue)?.actions || [];
  
  return actions
    .filter((a: C2paActionItem) => {
      // For created/edited actions, inspect the IPTC digitalSourceType for AI definitions
      const sourceType = a.digitalSourceType || a.parameters?.digitalSourceType || '';

      return sourceType.toLowerCase().includes('algorithmicmedia');
    })
    .map((a: C2paActionItem) => {
      const rawType = a.digitalSourceType || a.parameters?.digitalSourceType;
      // The UI expects the IPTC slug, not the full absolute URI
      const typeSlug = typeof rawType === 'string' ? rawType.split('/').pop() : 'legacy';
      
      let agentName = 'Unknown';

      if (a.softwareAgent) {
        if (typeof a.softwareAgent === 'string') {
          agentName = a.softwareAgent;
        } else if (typeof a.softwareAgent === 'object' && (a.softwareAgent as Record<string, unknown>).name) {
          agentName = (a.softwareAgent as Record<string, unknown>).name as string;
        }
      }

      return {
        softwareAgent: agentName,
        type: typeSlug || 'legacy'
      };
    });
}

import { filter, flow, uniqBy } from 'lodash/fp';
import startsWith from 'lodash/startsWith';

type SoftwareAgent = SdkGenerativeInfo['softwareAgent'];

export interface GenerativeInfo {
  softwareAgents: SoftwareAgent[];
  type: SdkGenerativeInfo['type'];
  customModels: CustomModel[];
}

export interface CustomModel {
  name: string;
  dataTypes: unknown[];
}

export function selectGenerativeSoftwareAgents(
  generativeInfo: SdkGenerativeInfo[],
): SoftwareAgent[] {
  const softwareAgents: SoftwareAgent[] = generativeInfo.map((assertion) => {
    return assertion?.softwareAgent;
  });

  // if there are undefined software agents remove them from the array
  return flow<[SoftwareAgent[]], SoftwareAgent[], SoftwareAgent[]>(
    filter((x) => !!x),
    uniqBy((x) => x),
  )(softwareAgents);
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
  const typesArray = ((ingredient as Record<string, unknown>).dataTypes || []) as Array<{ type: string }>;
  
  return typesArray.filter((dataType: { type: string }) =>
    startsWith('c2pa.types.model', dataType.type),
  );
}

export function selectCustomModels(manifest: Manifest): CustomModel[] {
  const ingredients = manifest.ingredients || [];
  const customModels: CustomModel[] = [];

  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i];
    const dataTypes = selectModelsFromIngredient(ingredient);

    if (dataTypes.length > 0) {
      customModels.push({ name: ingredient.title, dataTypes } as CustomModel);
    }
  }

  return customModels;
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
