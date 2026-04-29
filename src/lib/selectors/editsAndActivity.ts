import type { Manifest } from '@contentauth/c2pa-web';

export interface TranslatedDictionaryCategory {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

export async function selectEditsAndActivity(
  manifest: Manifest,
  locale: string
): Promise<TranslatedDictionaryCategory[]> {
  // Handle Legacy SDK (Map), Native SDK (Array), and crJSON (Object)
  let actionsAssertion;
  if (manifest.assertions instanceof Map) {
    actionsAssertion = manifest.assertions.get('c2pa.actions.v2')?.[0] || manifest.assertions.get('c2pa.actions')?.[0] || manifest.assertions.get('c2pa.actions.v2') || manifest.assertions.get('c2pa.actions');
  } else if (Array.isArray(manifest.assertions)) {
    actionsAssertion = manifest.assertions.find((a: any) => a.label === 'c2pa.actions' || a.label === 'c2pa.actions.v2');
  } else {
    actionsAssertion = manifest.assertions?.['c2pa.actions.v2'] || manifest.assertions?.['c2pa.actions'];
  }
  
  const actions = (actionsAssertion as any)?.data?.actions || (actionsAssertion as any)?.actions || [];

  const uniqueActionTypes = new Set<string>();
  actions.forEach((a: any) => uniqueActionTypes.add(a.action));

  const results: TranslatedDictionaryCategory[] = [];

  const baseUrl = 'https://cai-assertions.adobe.com/icons';

  for (const action of uniqueActionTypes) {
    switch (action) {
      case 'c2pa.created':
        results.push({ id: action, label: 'Created', description: 'The asset was created.', icon: `${baseUrl}/new-item-dark.svg` });
        break;
      case 'c2pa.generated':
        results.push({ id: action, label: 'Generated', description: 'The asset was generated.', icon: `${baseUrl}/algorithm-dark.svg` });
        break;
      case 'c2pa.edited':
      case 'c2pa.modified':
        results.push({ id: action, label: 'Edited', description: 'The asset was modified.', icon: `${baseUrl}/actions-dark.svg` });
        break;
      case 'c2pa.color_adjustments':
      case 'c2pa.color_adjustment':
      case 'c2pa.adjustedColor':
        results.push({ id: action, label: 'Color adjustments', description: 'Changes made to tone, saturation, or exposure.', icon: `${baseUrl}/color-palette-dark.svg` });
        break;
      case 'c2pa.cropped':
        results.push({ id: action, label: 'Cropped', description: 'The asset was cropped.', icon: `${baseUrl}/crop-dark.svg` });
        break;
      case 'c2pa.filtered':
      case 'c2pa.appliedFilter':
        results.push({ id: action, label: 'Filtered', description: 'Appearance changed with filters and effects.', icon: `${baseUrl}/properties-dark.svg` });
        break;
      case 'c2pa.resized':
        results.push({ id: action, label: 'Resized', description: 'The asset was resized.', icon: `${baseUrl}/resize-dark.svg` });
        break;
      case 'c2pa.orientation':
        results.push({ id: action, label: 'Orientation changed', description: 'The asset was rotated or flipped.', icon: `${baseUrl}/rotate-left-outline-dark.svg` });
        break;
      case 'c2pa.placed':
      case 'c2pa.imported':
        results.push({ id: action, label: 'Imported', description: 'Other assets were combined into this one.', icon: `${baseUrl}/import-dark.svg` });
        break;
      case 'c2pa.drawing':
        results.push({ id: action, label: 'Drawing', description: 'Digital painting or drawing was added.', icon: `${baseUrl}/draw-dark.svg` });
        break;
      case 'c2pa.converted':
      case 'c2pa.transcoded':
      case 'c2pa.format_conversion':
        results.push({ id: action, label: 'Format converted', description: 'The file format was changed or transcoded.', icon: `${baseUrl}/export-dark.svg` });
        break;
      case 'c2pa.deleted':
      case 'c2pa.removed':
        results.push({ id: action, label: 'Content removed', description: 'Content was deleted or removed from the asset.', icon: `${baseUrl}/actions-dark.svg` });
        break;
      case 'c2pa.dubbed':
      case 'c2pa.translated':
        results.push({ id: action, label: 'Audio/Text modified', description: 'Audio tracks or text were dubbed or translated.', icon: `${baseUrl}/actions-dark.svg` });
        break;
      case 'c2pa.published':
      case 'c2pa.repackaged':
        results.push({ id: action, label: 'Published', description: 'The asset was published or repackaged.', icon: `${baseUrl}/export-dark.svg` });
        break;
      case 'c2pa.watermarked':
        results.push({ id: action, label: 'Watermarked', description: 'A watermark was added.', icon: `${baseUrl}/actions-dark.svg` });
        break;
      case 'c2pa.redacted':
        results.push({ id: action, label: 'Redacted', description: 'Information was redacted from the manifest.', icon: `${baseUrl}/actions-dark.svg` });
        break;
      case 'c2pa.edited.metadata':
        results.push({ id: action, label: 'Metadata changed', description: 'Metadata was edited.', icon: `${baseUrl}/actions-dark.svg` });
        break;
      case 'c2pa.opened':
        results.push({ id: action, label: 'Opened', description: 'Opened a pre-existing file.', icon: `${baseUrl}/folder-open-outline-dark.svg` });
        break;
      case 'c2pa.saved':
      case 'c2pa.exported':
        results.push({ id: action, label: 'Saved', description: 'Saved the file.', icon: `${baseUrl}/export-dark.svg` });
        break;
      case 'c2pa.unknown':
        results.push({ id: action, label: 'Unknown action', description: 'An unknown edit or activity occurred.', icon: `${baseUrl}/actions-dark.svg` });
        break;
    }
  }

  return results;
}
