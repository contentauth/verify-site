// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

export function selectDoNotTrain(manifest: Manifest): boolean {
  const assertions = Array.isArray(manifest.assertions)
    ? manifest.assertions
    : [];

  // Check for the explicit do not train/mine assertion
  const trainingAssertionEntry = assertions.find(
    (a) => a.label === 'c2pa.training-mining',
  );

  if (trainingAssertionEntry) {
    type TrainingEntry = { use: string };
    type TrainingMining = { entries?: Record<string, TrainingEntry> };
    const trainingData = trainingAssertionEntry.data as
      | TrainingMining
      | undefined;
    const entries = trainingData?.entries;
    const hasDoNotTrain =
      entries != null &&
      Object.values(entries).some((e) => e.use === 'notAllowed');

    return hasDoNotTrain;
  }

  // Fallback: Check c2pa.actions for specific 'not_trained' markers
  type ActionsAssertion = { actions?: Array<{ action: string }> };
  const actionsEntry = assertions.find((a) => a.label === 'c2pa.actions');
  const actionsAssertion = actionsEntry?.data as ActionsAssertion | undefined;
  const actions = actionsAssertion?.actions ?? [];

  return actions.some((a) => a.action === 'c2pa.not_trained');
}
