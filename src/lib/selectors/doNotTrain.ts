// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

export function selectDoNotTrain(manifest: Manifest): boolean {
  const assertions = manifest.assertions;

  // Check for the explicit do not train/mine assertion
  let trainingAssertions: unknown;

  if (Array.isArray(assertions)) {
    trainingAssertions = assertions.find(
      (a): a is { label: string; data: unknown } =>
        typeof a === 'object' &&
        a !== null &&
        'label' in a &&
        typeof (a as Record<string, unknown>)['label'] === 'string' &&
        (a as Record<string, unknown>)['label'] === 'c2pa.training-mining'
    );
  } else if (assertions && typeof assertions === 'object') {
    trainingAssertions = (assertions as Record<string, unknown>)['c2pa.training-mining'];
  }

  if (trainingAssertions) {
    type TrainingEntry = { use: string; c2pa_manifest: boolean | string };
    type TrainingMining = { data?: { entries?: TrainingEntry[] } };
    
    const rawEntries = (trainingAssertions as TrainingMining)?.data?.entries || (trainingAssertions as { entries?: unknown })?.entries;
    const entriesList = Array.isArray(rawEntries)
      ? rawEntries
      : rawEntries && typeof rawEntries === 'object'
        ? Object.values(rawEntries)
        : [];

    const entry = (entriesList as TrainingEntry[])?.find((e: TrainingEntry) =>
      e.use === 'notAllowed' && (e.c2pa_manifest === true || e.c2pa_manifest === 'true')
    );

    return !!entry;
  }

  // Fallback: Check c2pa.actions for specific 'not_trained' markers
  type ActionsAssertion = { data?: { actions?: Array<{ action: string }> } };
  let actionsAssertion: unknown;

  if (Array.isArray(assertions)) {
    actionsAssertion = assertions.find(
      (a): a is { label: string; data: unknown } =>
        typeof a === 'object' &&
        a !== null &&
        'label' in a &&
        typeof (a as Record<string, unknown>)['label'] === 'string' &&
        (a as Record<string, unknown>)['label'] === 'c2pa.actions'
    );
  } else if (assertions && typeof assertions === 'object') {
    actionsAssertion = (assertions as Record<string, unknown>)['c2pa.actions'];
  }

  const actions = (actionsAssertion as ActionsAssertion)?.data?.actions ?? [];

  return actions.some((a) => a.action === 'c2pa.not_trained');
}
