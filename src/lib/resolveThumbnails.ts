// Copyright 2021-2024 Adobe, Copyright 2026 The C2PA Contributors

import type { ManifestStore, Reader } from '@contentauth/c2pa-web';

/**
 * Convert a relative thumbnail URI to absolute form. Already absolute
 * identifiers pass through unchanged.
 */
export function toAbsoluteIdentifier(
  identifier: string,
  manifestLabel: string,
): string {
  if (identifier.startsWith('self#jumbf=/c2pa/')) return identifier;

  if (identifier.startsWith('self#jumbf=')) {
    const path = identifier.slice('self#jumbf='.length);

    return `self#jumbf=/c2pa/${manifestLabel}/${path}`;
  }

  return identifier;
}

/** Pre-fetch every embedded thumbnail's bytes, keyed by absolute identifier. */
export async function resolveThumbnails(
  manifestStore: ManifestStore,
  reader: Reader,
): Promise<Map<string, Blob>> {
  const refs = new Map<string, string>();

  for (const [label, manifest] of Object.entries(
    manifestStore.manifests || {},
  )) {
    if (manifest.thumbnail?.identifier && manifest.thumbnail.format) {
      refs.set(
        toAbsoluteIdentifier(manifest.thumbnail.identifier, label),
        manifest.thumbnail.format,
      );
    }

    for (const ingredient of manifest.ingredients || []) {
      if (ingredient.thumbnail?.identifier && ingredient.thumbnail.format) {
        refs.set(
          toAbsoluteIdentifier(ingredient.thumbnail.identifier, label),
          ingredient.thumbnail.format,
        );
      }
    }
  }

  const entries = await Promise.all(
    Array.from(refs.entries()).map(
      async ([identifier, format]): Promise<[string, Blob] | null> => {
        try {
          const bytes = await reader.resourceToBytes(identifier);

          return [
            identifier,
            new Blob([new Uint8Array(bytes)], { type: format }),
          ];
        } catch (err) {
          console.warn(`Failed to resolve thumbnail ${identifier}:`, err);

          return null;
        }
      },
    ),
  );

  return new Map(entries.filter((e): e is [string, Blob] => e !== null));
}
