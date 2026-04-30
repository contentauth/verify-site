// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { describe, expect, it } from 'vitest';
import {
  getActiveManifestValidationStatus,
  getAssertionDataByLabel,
  getAssertionsList,
  getClaimInfo,
  getSignatureInfo,
  isCrJson,
  legacyToCrJson,
  type CrJson,
  type CrJsonManifestEntry,
  type CrJsonValidationResults,
} from './crjson';

const makeManifest = (overrides: Partial<CrJsonManifestEntry> = {}): CrJsonManifestEntry => ({
  label: 'urn:test:manifest',
  assertions: {},
  ...overrides,
});

const makeReport = (overrides: Partial<CrJson> = {}): CrJson => ({
  '@context': { '@vocab': 'https://contentcredentials.org/crjson' },
  manifests: [makeManifest()],
  ...overrides,
});

describe('lib/crjson', () => {
  describe('isCrJson()', () => {
    it('returns true for a valid crJSON object', () => {
      expect(isCrJson(makeReport())).toBe(true);
    });

    it('returns false when @context is missing', () => {
      const obj = { manifests: [makeManifest()] };
      expect(isCrJson(obj)).toBe(false);
    });

    it('returns false when manifests array is empty', () => {
      expect(isCrJson({ '@context': {}, manifests: [] })).toBe(false);
    });

    it('returns false for non-object input', () => {
      expect(isCrJson(null)).toBe(false);
      expect(isCrJson('string')).toBe(false);
      expect(isCrJson(42)).toBe(false);
    });
  });

  describe('getAssertionsList()', () => {
    it('converts assertions object to label/data pairs', () => {
      const m = makeManifest({
        assertions: { 'c2pa.actions': { actions: [] }, 'stds.schema-org.CreativeWork': { name: 'test' } },
      });
      const list = getAssertionsList(m);
      expect(list).toHaveLength(2);
      expect(list.find((a) => a.label === 'c2pa.actions')?.data).toEqual({ actions: [] });
    });

    it('returns empty array for a manifest with no assertions', () => {
      expect(getAssertionsList(makeManifest({ assertions: {} }))).toEqual([]);
    });
  });

  describe('getAssertionDataByLabel()', () => {
    it('returns data for a known label', () => {
      const m = makeManifest({ assertions: { 'c2pa.actions': { actions: [{ action: 'c2pa.created' }] } } });
      const data = getAssertionDataByLabel(m, 'c2pa.actions') as { actions: unknown[] };
      expect(data.actions).toHaveLength(1);
    });

    it('returns undefined for an unknown label', () => {
      expect(getAssertionDataByLabel(makeManifest(), 'does.not.exist')).toBeUndefined();
    });
  });

  describe('getSignatureInfo()', () => {
    it('returns undefined when no signature is present', () => {
      expect(getSignatureInfo(makeManifest())).toBeUndefined();
    });

    it('extracts common_name from a DN object', () => {
      const m = makeManifest({
        signature: {
          algorithm: 'Es256',
          certificateInfo: {
            subject: { CN: 'Example Corp', O: 'Example Inc.' },
            issuer: { CN: 'Root CA' },
          },
          timeStampInfo: { timestamp: '2025-01-01T00:00:00Z' },
        },
      });
      const info = getSignatureInfo(m);
      expect(info).not.toBeUndefined();
      expect(info?.common_name).toBe('Example Corp');
      expect(info?.organization).toBe('Example Inc.');
      expect(info?.issuer).toBe('Root CA');
      expect(info?.time).toBe('2025-01-01T00:00:00Z');
    });

    it('extracts common_name from a plain string subject', () => {
      const m = makeManifest({
        signature: {
          algorithm: 'Es256',
          certificateInfo: { subject: 'Flat Name', issuer: 'Flat Issuer' },
          timeStampInfo: { timestamp: '2025-06-01T00:00:00Z' },
        },
      });
      const info = getSignatureInfo(m);
      expect(info?.common_name).toBe('Flat Name');
    });
  });

  describe('getClaimInfo()', () => {
    it('reads claim_generator_info array', () => {
      const m = makeManifest({
        claim: {
          claim_generator: 'TestApp/1.0',
          claim_generator_info: [{ name: 'TestApp', version: '1.0' }],
          instanceID: 'xmp:iid:abc',
        },
      });
      const info = getClaimInfo(m);
      expect(info.claim_generator_info).toHaveLength(1);
      expect(info.claim_generator_info[0].name).toBe('TestApp');
      expect(info.instance_id).toBe('xmp:iid:abc');
    });

    it('falls back to claim_generator string when info array is absent', () => {
      const m = makeManifest({ claim: { claim_generator: 'SimpleGen/2.0' } });
      const info = getClaimInfo(m);
      expect(info.claim_generator_info).toHaveLength(1);
      expect(info.claim_generator_info[0].name).toBe('SimpleGen/2.0');
    });

    it('returns empty array when claim is absent', () => {
      const info = getClaimInfo(makeManifest());
      expect(info.claim_generator_info).toEqual([]);
    });
  });

  describe('getActiveManifestValidationStatus()', () => {
    it('returns document-level activeManifest status when present and non-empty', () => {
      const report = makeReport({
        validationResults: {
          activeManifest: {
            success: [{ code: 'claimSignature.validated', url: 'x' }],
            failure: [],
            informational: [],
          },
        },
      });
      const status = getActiveManifestValidationStatus(report);
      expect(status?.success).toHaveLength(1);
    });

    it('falls back to per-manifest validationResults when doc-level is absent', () => {
      const perManifestValidation: CrJsonValidationResults = {
        success: [],
        informational: [],
        failure: [{ code: 'signingCredential.untrusted', url: 'Cose_Sign1' }],
      };
      const report = makeReport({
        manifests: [makeManifest({ validationResults: perManifestValidation } as unknown as Partial<CrJsonManifestEntry>)],
      });
      const status = getActiveManifestValidationStatus(report);
      expect(status?.failure).toHaveLength(1);
      expect(status?.failure?.[0].code).toBe('signingCredential.untrusted');
    });
  });

  describe('legacyToCrJson()', () => {
    it('converts a legacy ManifestStore to crJSON', () => {
      const legacy = {
        active_manifest: 'urn:legacy:manifest',
        manifests: {
          'urn:legacy:manifest': {
            assertions: [
              { label: 'c2pa.actions', data: { actions: [{ action: 'c2pa.created' }] } },
            ],
            claim_generator_info: [{ name: 'LegacyApp', version: '0.9' }],
            signature_info: {
              alg: 'Es256',
              common_name: 'Legacy Corp',
              issuer: 'Legacy CA',
              time: '2024-01-01T00:00:00Z',
            },
          },
        },
        validation_results: {
          activeManifest: {
            success: [{ code: 'claimSignature.validated', url: 'x' }],
            failure: [],
            informational: [],
          },
        },
      };

      const cr = legacyToCrJson(legacy);
      expect(cr['@context']).toBeDefined();
      expect(cr.manifests).toHaveLength(1);
      expect(cr.manifests[0].label).toBe('urn:legacy:manifest');
      // Assertions array should be converted to object keyed by label
      expect(cr.manifests[0].assertions['c2pa.actions']).toBeDefined();
      // Signature should be mapped
      const sig = cr.manifests[0].signature as Record<string, unknown>;
      const certInfo = sig?.certificateInfo as Record<string, unknown>;
      expect(certInfo?.subject).toBe('Legacy Corp');
      // validationResults should be propagated into the active manifest
      const vr = cr.manifests[0].validationResults as CrJsonValidationResults;
      expect(vr?.success).toHaveLength(1);
    });

    it('places active manifest first regardless of key order', () => {
      const legacy = {
        active_manifest: 'urn:b',
        manifests: {
          'urn:a': { assertions: [] },
          'urn:b': { assertions: [] },
          'urn:c': { assertions: [] },
        },
      };
      const cr = legacyToCrJson(legacy);
      expect(cr.manifests[0].label).toBe('urn:b');
    });

    it('handles empty manifests gracefully', () => {
      const cr = legacyToCrJson({});
      expect(cr.manifests).toEqual([]);
    });
  });
});
