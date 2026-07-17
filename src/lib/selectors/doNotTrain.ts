// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

export function selectDoNotTrain(manifest: Manifest): boolean {
  const assertionsArray = (manifest.assertions || []) as unknown[];
  type AssertionItem = { label?: string; data?: unknown };

  // 1. Search for modern c2pa.training-mining assertion array block item
  const trainingAss = assertionsArray.find(
    (a: unknown) => (a as AssertionItem).label === 'c2pa.training-mining',
  ) as AssertionItem | undefined;

  if (trainingAss) {
    // The c2pa.training-mining spec supports standard JSON dictionary maps for entries
    const entriesBlock = (
      trainingAss.data as Record<string, unknown> | undefined
    )?.entries;

    if (entriesBlock && typeof entriesBlock === 'object') {
      const entries = entriesBlock as Record<string, Record<string, string>>;

      // Audit all known standard generative AI and data-mining blockers
      const blockers = [
        entries['c2pa.ai_generative_training'],
        entries['c2pa.ai_inference'],
        entries['c2pa.ai_training'],
        entries['c2pa.data_mining'],
      ];

      for (let i = 0; i < blockers.length; i++) {
        if (blockers[i]?.use === 'notAllowed') {
          return true;
        }
      }
    }
  }

  // 2. Fallback: Search c2pa.actions array item for historical 'c2pa.not_trained' action markers
  const actionsAss = assertionsArray.find(
    (a: unknown) =>
      (a as AssertionItem).label === 'c2pa.actions' ||
      (a as AssertionItem).label === 'c2pa.actions.v2',
  ) as AssertionItem | undefined;

  if (actionsAss) {
    type ActionEntry = { action: string };
    const actions = ((actionsAss.data as Record<string, unknown> | undefined)
      ?.actions ||
      (actionsAss as Record<string, unknown> | undefined)?.actions ||
      []) as ActionEntry[];

    for (let i = 0; i < actions.length; i++) {
      if (actions[i].action === 'c2pa.not_trained') {
        return true;
      }
    }
  }

  return false;
}

// Spacing check comment to force a new git SHA and bust stale GitHub Actions lint caches.
