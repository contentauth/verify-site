// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { describe, expect, it } from 'vitest';
import type { Manifest } from '@contentauth/c2pa-web';
import { selectCawgRoles } from './cawgRoles';

/**
 * Build a minimal Manifest-like object with the given assertions and
 * (optionally) top-level signature_info. Cast to Manifest since selectCawgRoles
 * only reads `assertions` and `signature_info`.
 */
function makeManifest(
  assertions: Array<{ label?: string; data?: unknown }>,
  signatureInfo?: { issuer?: string },
): Manifest {
  return {
    assertions,
    signature_info: signatureInfo,
  } as unknown as Manifest;
}

describe('lib/selectors/cawgRoles', () => {
  describe('selectCawgRoles()', () => {
    it('returns an empty array when there are no assertions', () => {
      expect(selectCawgRoles(makeManifest([]))).toEqual([]);
    });

    it('returns an empty array when no CAWG assertions are present', () => {
      const manifest = makeManifest([
        { label: 'c2pa.actions.v2', data: { actions: [] } },
      ]);
      expect(selectCawgRoles(manifest)).toEqual([]);
    });

    it('extracts creator, contributor and publisher from cawg.metadata dc: fields', () => {
      const manifest = makeManifest([
        {
          label: 'cawg.metadata',
          data: {
            '@context': { dc: 'http://purl.org/dc/elements/1.1/' },
            'dc:creator': ['Google LLC'],
            'dc:contributor': ['Google LLC'],
            'dc:publisher': 'Google LLC',
          },
        },
      ]);

      expect(selectCawgRoles(manifest)).toEqual([
        { role: 'creator', name: 'Google LLC' },
        { role: 'contributor', name: 'Google LLC' },
        { role: 'publisher', name: 'Google LLC' },
      ]);
    });

    it('joins multiple dc: values into a single name', () => {
      const manifest = makeManifest([
        {
          label: 'cawg.metadata',
          data: {
            'dc:creator': ['Alice', 'Bob'],
          },
        },
      ]);

      expect(selectCawgRoles(manifest)).toEqual([
        { role: 'creator', name: 'Alice, Bob' },
      ]);
    });

    it('extracts named roles from cawg.identity signer_payload.role using the issuer', () => {
      const manifest = makeManifest([
        {
          label: 'cawg.identity',
          data: {
            signer_payload: {
              role: ['cawg.editor', 'cawg.sponsor'],
            },
            signature_info: {
              issuer: 'Google LLC',
            },
          },
        },
      ]);

      expect(selectCawgRoles(manifest)).toEqual([
        { role: 'editor', name: 'Google LLC' },
        { role: 'sponsor', name: 'Google LLC' },
      ]);
    });

    it('falls back to the manifest signature_info issuer for identity roles', () => {
      const manifest = makeManifest(
        [
          {
            label: 'cawg.identity',
            data: {
              signer_payload: {
                role: ['cawg.producer'],
              },
            },
          },
        ],
        { issuer: 'Manifest Signer' },
      );

      expect(selectCawgRoles(manifest)).toEqual([
        { role: 'producer', name: 'Manifest Signer' },
      ]);
    });

    it('merges roles from both cawg.metadata and cawg.identity', () => {
      const manifest = makeManifest([
        {
          label: 'cawg.metadata',
          data: {
            'dc:creator': ['Google LLC'],
          },
        },
        {
          label: 'cawg.identity',
          data: {
            signer_payload: {
              role: ['cawg.editor'],
            },
            signature_info: {
              issuer: 'Google LLC',
            },
          },
        },
      ]);

      expect(selectCawgRoles(manifest)).toEqual([
        { role: 'creator', name: 'Google LLC' },
        { role: 'editor', name: 'Google LLC' },
      ]);
    });

    it('de-duplicates by role key, keeping the cawg.metadata name', () => {
      const manifest = makeManifest([
        {
          label: 'cawg.metadata',
          data: {
            'dc:creator': ['Metadata Name'],
          },
        },
        {
          label: 'cawg.identity',
          data: {
            signer_payload: {
              role: ['cawg.creator'],
            },
            signature_info: {
              issuer: 'Identity Issuer',
            },
          },
        },
      ]);

      expect(selectCawgRoles(manifest)).toEqual([
        { role: 'creator', name: 'Metadata Name' },
      ]);
    });

    it('matches assertion labels that include a JUMBF hash suffix', () => {
      const manifest = makeManifest([
        {
          label: 'cawg.metadata__abc123',
          data: {
            'dc:publisher': 'Google LLC',
          },
        },
      ]);

      expect(selectCawgRoles(manifest)).toEqual([
        { role: 'publisher', name: 'Google LLC' },
      ]);
    });

    it('ignores empty dc: values', () => {
      const manifest = makeManifest([
        {
          label: 'cawg.metadata',
          data: {
            'dc:creator': [],
            'dc:contributor': null,
            'dc:publisher': 'Google LLC',
          },
        },
      ]);

      expect(selectCawgRoles(manifest)).toEqual([
        { role: 'publisher', name: 'Google LLC' },
      ]);
    });

    it('ignores unknown roles in signer_payload.role', () => {
      const manifest = makeManifest([
        {
          label: 'cawg.identity',
          data: {
            signer_payload: {
              role: ['cawg.unknown', 'cawg.translator'],
            },
            signature_info: {
              issuer: 'Google LLC',
            },
          },
        },
      ]);

      expect(selectCawgRoles(manifest)).toEqual([
        { role: 'translator', name: 'Google LLC' },
      ]);
    });
  });
});
