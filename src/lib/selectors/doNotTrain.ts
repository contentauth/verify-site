// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
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

// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import type { Manifest } from 'c2pa';
import { pick, reduce } from 'lodash';

export const ENTRY_KEYS = [
  'c2pa.data_mining',
  'c2pa.ai_inference',
  'c2pa.ai_training',
  'c2pa.ai_generative_training',
] as const;

export const NOT_ALLOWED_VALUE = 'notAllowed';

export type EntryKey = (typeof ENTRY_KEYS)[number];

type EntryMap = Record<EntryKey, string>;

declare module 'c2pa' {
  interface ExtendedAssertions {
    'c2pa.training-mining': {
      entries: EntryMap;
    };
  }
}

export interface DoNotTrainResult {
  trainingAllowed: boolean;
  disallowedActions: EntryKey[];
}

export function selectDoNotTrain(manifest: Manifest): DoNotTrainResult {
  const entries =
    manifest.assertions.get('c2pa.training-mining')[0]?.data?.entries ??
    ({} as EntryMap);
  const filteredEntries = pick(entries, ENTRY_KEYS);
  const disallowedActions = reduce<EntryMap, EntryKey[]>(
    filteredEntries,
    (acc, val, entry) => {
      if (val === NOT_ALLOWED_VALUE) {
        return [...acc, entry] as EntryKey[];
      }

      return acc;
    },
    [],
  );

  return {
    trainingAllowed: disallowedActions.length === 0,
    disallowedActions,
  };
}
