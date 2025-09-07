// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import {
  selectGenerativeInfo as sdkSelectGenerativeInfo,
  type DataType,
  type Ingredient,
  type Manifest,
  type GenerativeInfo as SdkGenerativeInfo,
} from 'c2pa';
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
  dataTypes: DataType[];
}

export function selectGenerativeSoftwareAgents(
  generativeInfo: SdkGenerativeInfo[],
): SoftwareAgent[] {
  const softwareAgents: SoftwareAgent[] = generativeInfo.map((assertion) => {
    return assertion?.softwareAgent;
  });

  // if there are undefined software agents remove them from the array
  return flow<[SoftwareAgent[]], SoftwareAgent[], SoftwareAgent[]>(
    filter((x) => !!x?.name || x),
    uniqBy((x) => x?.name || x),
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
  return (
    ingredient.dataTypes?.filter((dataType: { type: string }) =>
      startsWith('c2pa.types.model', dataType.type),
    ) ?? []
  );
}

export function selectCustomModels(manifest: Manifest): CustomModel[] {
  return manifest.ingredients.reduce<CustomModel[]>((acc, ingredient) => {
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
