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

export function selectAutoDubInfo(manifest: Manifest): AutoDubInfo | null {
  const assertions = manifest.assertions;
  let actionAssertion: unknown;

  if (Array.isArray(assertions)) {
    actionAssertion = assertions.find(
      (a): a is { label: string; data: unknown } =>
        typeof a === 'object' &&
        a !== null &&
        'label' in a &&
        typeof (a as Record<string, unknown>)['label'] === 'string' &&
        (a as Record<string, unknown>)['label'] === 'c2pa.actions.v2',
    );
  } else if (assertions && typeof assertions === 'object') {
    actionAssertion = (assertions as Record<string, unknown>)[
      'c2pa.actions.v2'
    ];
  }

  if (!actionAssertion) {
    return null;
  }

  type ActionItem = {
    action: string;
    changes?: Array<{
      region?: Array<{ type?: string; item?: { value?: string } }>;
    }>;
    parameters?: unknown;
  };
  type ActionsAssertion = { data?: { actions?: ActionItem[] } };

  const dubbedAction = (
    actionAssertion as ActionsAssertion
  ).data?.actions?.find(({ action }) => action === 'c2pa.dubbed');
  const translatedAction = (
    actionAssertion as ActionsAssertion
  ).data?.actions?.find(({ action }) => action === 'c2pa.translated');
  const editedAction = (
    actionAssertion as ActionsAssertion
  ).data?.actions?.find(({ action }) => action === 'c2pa.edited');

  if (dubbedAction) {
    const dubbedRegionOfInterest = dubbedAction.changes?.find(
      (change) => !!change?.region,
    )?.region;
    const dubbedIdentified = dubbedRegionOfInterest?.find(
      (region: Record<string, unknown>) => region.type === 'identified',
    )?.item?.value;
    const hasLipsRoi = dubbedIdentified === 'lips';

    const editedRegionOfInterest = editedAction?.changes?.find(
      (change) => !!change?.region,
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
