// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

export function selectDoNotTrain(manifest: Manifest): boolean {
  // Check for the explicit do not train/mine assertion
  const trainingAssertions = manifest.assertions?.['c2pa.training-mining'];

  if (trainingAssertions) {
    type TrainingEntry = { use: string; c2pa_manifest: boolean | string };
    type TrainingMining = { data?: { entries?: TrainingEntry[] } };
    const entry = (trainingAssertions as TrainingMining)?.data?.entries?.find((e: TrainingEntry) =>
      e.use === 'notAllowed' && (e.c2pa_manifest === true || e.c2pa_manifest === 'true')
    );

    return !!entry;
  }

  // Fallback: Check c2pa.actions for specific 'not_trained' markers
  type ActionsAssertion = { data?: { actions?: Array<{ action: string }> } };
  const actionsAssertion = manifest.assertions?.['c2pa.actions'] as ActionsAssertion | undefined;
  const actions = actionsAssertion?.data?.actions ?? [];

  return actions.some((a) => a.action === 'c2pa.not_trained');
}
