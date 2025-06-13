// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from 'c2pa';

export interface TranslatedActionDataParams {
  sourceLanguage: string;
  targetLanguage: string;
}

export interface AutoDubInfo {
  hasLipsRoi: boolean;
  hasTranscriptRoi: boolean;
  translatedData: TranslatedActionDataParams | null;
}

export function selectAutoDubInfo(manifest: Manifest): AutoDubInfo | null {
  const [actionAssertion] = manifest.assertions.get('c2pa.actions.v2');

  if (!actionAssertion) {
    return null;
  }

  const dubbedAction = actionAssertion.data.actions.find(
    ({ action }) => action === 'c2pa.dubbed',
  );
  const translatedAction = actionAssertion.data.actions.find(
    ({ action }) => action === 'c2pa.translated',
  );
  const editedAction = actionAssertion.data.actions.find(
    ({ action }) => action === 'c2pa.edited',
  );

  if (dubbedAction) {
    const dubbedRegionOfInterest = dubbedAction.changes?.find(
      (change) => !!change?.region,
    )?.region;
    const dubbedIdentified = dubbedRegionOfInterest?.find(
      (region: Record<string, unknown>) => region.type === 'identified',
    )?.item.value;
    const hasLipsRoi = dubbedIdentified === 'lips';

    const editedRegionOfInterest = editedAction?.changes?.find(
      (change) => !!change?.region,
    )?.region;
    const editedIdentified = editedRegionOfInterest?.find(
      (region: Record<string, unknown>) => region.type === 'identified',
    )?.item.value;
    const hasTranscriptRoi = editedIdentified === 'transcript';

    const translatedLanguageData = translatedAction?.parameters ?? null;

    return {
      hasLipsRoi,
      hasTranscriptRoi,
      translatedData: translatedLanguageData as TranslatedActionDataParams,
    };
  }

  return null;
}
