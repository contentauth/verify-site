// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

export interface TranslatedActionDataParams {
  sourceLanguage: string;
  targetLanguage: string;
}

export interface AutoDubInfo {
  hasLipsRoi: boolean;
  hasTranscriptRoi: boolean;
  translatedData: TranslatedActionDataParams | null;
}

type ActionItem = {
  action: string;
  changes?: Array<{
    region?: Array<{ type: string; item?: { value: string } }>;
  }>;
  parameters?: unknown;
};
type ActionAssertionData = { actions?: ActionItem[] };

export function selectAutoDubInfo(manifest: Manifest): AutoDubInfo | null {
  const assertions = Array.isArray(manifest.assertions)
    ? manifest.assertions
    : [];
  const actionAssertionEntry = assertions.find(
    (a) => a.label === 'c2pa.actions.v2',
  );
  const actionAssertion = actionAssertionEntry?.data as
    | ActionAssertionData
    | undefined;

  if (!actionAssertion?.actions) {
    return null;
  }

  const dubbedAction = actionAssertion.actions.find(
    ({ action }) => action === 'c2pa.dubbed',
  );
  const translatedAction = actionAssertion.actions.find(
    ({ action }) => action === 'c2pa.translated',
  );
  const editedAction = actionAssertion.actions.find(
    ({ action }) => action === 'c2pa.edited',
  );

  if (dubbedAction) {
    const dubbedRegionOfInterest = dubbedAction.changes?.find(
      (change: { region?: unknown }) => !!change?.region,
    )?.region;
    const dubbedIdentified = dubbedRegionOfInterest?.find(
      (region: Record<string, unknown>) => region.type === 'identified',
    )?.item?.value;
    const hasLipsRoi = dubbedIdentified === 'lips';

    const editedRegionOfInterest = editedAction?.changes?.find(
      (change: { region?: unknown }) => !!change?.region,
    )?.region;
    const editedIdentified = editedRegionOfInterest?.find(
      (region: Record<string, unknown>) => region.type === 'identified',
    )?.item?.value;
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
