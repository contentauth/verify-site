// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

export interface TranslatedDictionaryCategory {
  id: string;
  label: string;
  description: string;
}

export async function selectEditsAndActivity(
  manifest: Manifest,
  locale: string
): Promise<TranslatedDictionaryCategory[]> {
  const actionsAssertion = manifest.assertions?.['c2pa.actions'];
  const actions = (actionsAssertion as any)?.data?.actions || [];

  const uniqueActionTypes = new Set<string>();
  actions.forEach((a: any) => uniqueActionTypes.add(a.action));

  const results: TranslatedDictionaryCategory[] = [];

  // Standard mapping for common actions (normally this would use a localized dictionary JSON)
  for (const action of uniqueActionTypes) {
    switch (action) {
      case 'c2pa.edited':
      case 'c2pa.opened':
      case 'c2pa.saved':
        results.push({ id: action, label: 'Edited', description: 'The asset was modified.' });
        break;
      case 'c2pa.created':
      case 'c2pa.generated':
        results.push({ id: action, label: 'Generated', description: 'The asset was generated.' });
        break;
      case 'c2pa.cropped':
        results.push({ id: action, label: 'Cropped', description: 'The asset was cropped.' });
        break;
      case 'c2pa.color_adjustments':
        results.push({ id: action, label: 'Color Adjustments', description: 'Colors were adjusted.' });
        break;
      case 'c2pa.filtered':
        results.push({ id: action, label: 'Filtered', description: 'A filter was applied.' });
        break;
      // We can add more standard mappings as needed. 
      // The legacy SDK downloaded a massive locale dictionary for this.
    }
  }

  return results;
}
