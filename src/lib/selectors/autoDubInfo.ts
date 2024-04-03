// ADOBE CONFIDENTIAL
// Copyright 2024 Adobe
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

import type { Manifest } from 'c2pa';

interface TemporalRegion {
  type: 'temporal';
  time: Record<string, unknown>;
}

interface IdentifiedRegion {
  type: 'identified';
  item: {
    identifier: string;
    value: 'lips' | 'transcript';
  };
}

type Region = TemporalRegion | IdentifiedRegion;

interface Change {
  region: Region[];
}

interface DubbedActionData {
  action: 'c2pa.dubbed';
  digitalSourceType: string;
  changes: Change[];
}

interface EditedActionData {
  action: 'c2pa.edited';
  digitalSourceType: string;
  changes: Change[];
}

export interface TranslatedActionDataParams {
  sourceLanguage: string;
  targetLanguage: string;
}

interface TranslatedActionData {
  action: 'c2pa.translated';
  digitalSourceType: string;
  parameters: TranslatedActionDataParams;
}

type Actions = DubbedActionData | EditedActionData | TranslatedActionData;

interface V2ActionAssertion {
  actions: Actions[];
}

declare module 'c2pa' {
  interface ExtendedAssertions {
    'c2pa.actions.v2': V2ActionAssertion;
  }
}

export interface AutoDubInfo {
  hasLipsRoi: boolean;
  hasTranscriptRoi: boolean;
  translatedData: TranslatedActionData['parameters'] | null;
}

export function selectAutoDubInfo(manifest: Manifest): AutoDubInfo | null {
  const [actionAssertion] = manifest.assertions.get('c2pa.actions.v2');

  if (!actionAssertion) {
    return null;
  }

  const dubbedAction = actionAssertion.data.actions.find(isDubbedAction);
  const translatedAction =
    actionAssertion.data.actions.find(isTranslatedAction);
  const editedAction = actionAssertion.data.actions.find(isEditedAction);

  if (dubbedAction) {
    const dubbedRegionOfInterest = dubbedAction.changes.find(
      (change) => !!change?.region,
    )?.region;
    const dubbedIdentified =
      dubbedRegionOfInterest?.find(isIdentifiedRegion)?.item.value;
    const hasLipsRoi = dubbedIdentified === 'lips';

    const editedRegionOfInterest = editedAction?.changes.find(
      (change) => !!change?.region,
    )?.region;
    const editedIdentified =
      editedRegionOfInterest?.find(isIdentifiedRegion)?.item.value;
    const hasTranscriptRoi = editedIdentified === 'transcript';

    const translatedLanguageData = translatedAction?.parameters ?? null;

    return {
      hasLipsRoi,
      hasTranscriptRoi,
      translatedData: translatedLanguageData,
    };
  }

  return null;
}

function isDubbedAction(action: Actions): action is DubbedActionData {
  return action.action === 'c2pa.dubbed';
}

function isEditedAction(action: Actions): action is EditedActionData {
  return action.action === 'c2pa.edited';
}

function isTranslatedAction(action: Actions): action is TranslatedActionData {
  return action.action === 'c2pa.translated';
}

function isIdentifiedRegion(region: Region): region is IdentifiedRegion {
  return region.type === 'identified';
}
