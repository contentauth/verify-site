// Copyright 2021-2024 Adobe, Copyright 2026 The C2PA Contributors

/** Validation status entry in crJSON (code, optional url, explanation) */
export interface CrJsonValidationStatus {
  code: string;
  url?: string;
  explanation?: string;
}

/** activeManifest block inside validationResults */
export interface CrJsonActiveManifestStatus {
  success?: CrJsonValidationStatus[];
  informational?: CrJsonValidationStatus[];
  failure?: CrJsonValidationStatus[];
}

/** validationResults in crJSON (camelCase). Document-level has activeManifest; per-manifest has status codes directly. */
export interface CrJsonValidationResults {
  activeManifest?: CrJsonActiveManifestStatus;
  success?: CrJsonValidationStatus[];
  informational?: CrJsonValidationStatus[];
  failure?: CrJsonValidationStatus[];
  [key: string]: unknown;
}

/** Single manifest entry in crJSON manifests array */
export interface CrJsonManifestEntry {
  label: string;
  assertions: Record<string, unknown>;
  claim?: Record<string, unknown>;
  'claim.v2'?: Record<string, unknown>;
  signature?: Record<string, unknown>;
  status?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Root crJSON structure from Reader.crjson() */
export interface CrJson {
  '@context'?: Record<string, unknown>;
  manifests: CrJsonManifestEntry[];
  validationResults?: CrJsonValidationResults;
  jsonGenerator?: Record<string, unknown>;
  [key: string]: unknown;
}

/** Assertion as list item: { label, data } from crJSON manifest.assertions object */
export interface CrJsonAssertionItem {
  label: string;
  data: unknown;
}

/** Ingredient derived from crJSON manifest.assertions (c2pa.ingredient entries) */
export interface CrJsonIngredientItem {
  title?: string;
  format?: string;
  document_id?: unknown;
  instance_id?: unknown;
  relationship?: string;
  active_manifest?: string;
  [key: string]: unknown;
}

/** Signature info read from crJSON manifest.signature */
export interface CrJsonSignatureInfo {
  alg: string;
  common_name: string;
  organization?: string;
  issuer: string;
  time: string;
}

/** Claim info read from crJSON manifest.claim or manifest['claim.v2'] */
export interface CrJsonClaimInfo {
  claim_generator?: string;
  claim_generator_info: Array<{
    name?: string;
    version?: string;
    [key: string]: unknown;
  }>;
  instance_id?: string;
}

/** Detect if parsed JSON is crJSON format */
export function isCrJson(obj: unknown): obj is CrJson {
  const o = obj as Record<string, unknown>;

  return (
    Array.isArray(o?.manifests) &&
    o.manifests.length > 0 &&
    o['@context'] != null
  );
}

/** Read assertions as list from crJSON manifest.assertions (object → array of { label, data }) */
export function getAssertionsList(
  m: CrJsonManifestEntry,
): CrJsonAssertionItem[] {
  const assertions = m.assertions ?? {};

  return Object.entries(assertions).map(([label, data]) => ({ label, data }));
}

/** Read ingredients from crJSON manifest.assertions (c2pa.ingredient and entries with document_id/instance_id) */
export function getIngredientsFromManifest(
  m: CrJsonManifestEntry,
): CrJsonIngredientItem[] {
  const assertions = m.assertions ?? {};
  const out: CrJsonIngredientItem[] = [];

  for (const [assertionLabel, data] of Object.entries(assertions)) {
    const d = data as Record<string, unknown>;

    if (
      assertionLabel === 'c2pa.ingredient' ||
      (d?.document_id != null && d?.instance_id != null)
    ) {
      out.push({
        title: (d.title ?? d.dc_title ?? assertionLabel) as string,
        format: (d.format ?? d.dc_format ?? '') as string,
        document_id: d.document_id,
        instance_id: d.instance_id,
        relationship: (d.relationship ?? d['dc:relationship']) as
          | string
          | undefined,
        active_manifest: (d.active_manifest ?? d.activeManifest) as
          | string
          | undefined,
      });
    }
  }

  return out;
}

/**
 * Convert certificate subject/issuer to display string.
 * c2pa-rs crJSON uses DN component objects { CN, O, OU, L, ST, C }; extract string or format.
 */
function certFieldToString(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'object' || Array.isArray(value)) return '';
  const obj = value as Record<string, unknown>;
  // DN components: prefer CN for common name; for full display join key=value
  const cn = obj.CN ?? obj.cn;
  if (cn != null && typeof cn === 'string') return cn;
  const parts: string[] = [];
  const order = ['CN', 'O', 'OU', 'L', 'ST', 'C'];

  for (const key of order) {
    const v = obj[key] ?? obj[key.toLowerCase()];
    if (v != null && typeof v === 'string') parts.push(`${key}=${v}`);
  }

  if (parts.length > 0) return parts.join(', ');

  return '';
}

/** Read signature display info from crJSON manifest.signature */
export function getSignatureInfo(
  m: CrJsonManifestEntry,
): CrJsonSignatureInfo | undefined {
  const sig = m.signature as Record<string, unknown> | undefined;
  if (!sig || typeof sig !== 'object') return undefined;
  // crJSON from c2pa-rs: certificateInfo (camelCase), subject/issuer are DN objects { CN, O, ... }
  const certInfo = (sig.certificateInfo ??
    sig.certificate_info ??
    {}) as Record<string, unknown>;
  const tsInfo = (sig.timeStampInfo ??
    sig.time_stamp_info ??
    sig.timeStamp ??
    {}) as Record<string, unknown>;
  const alg = (sig.algorithm ?? sig.alg ?? '') as string;

  const subjectObj =
    typeof certInfo.subject === 'object' && certInfo.subject !== null
      ? (certInfo.subject as Record<string, unknown>)
      : {};

  const common_name =
    certFieldToString(certInfo.subject) ||
    (typeof certInfo.common_name === 'string' ? certInfo.common_name : '') ||
    (typeof certInfo.commonName === 'string' ? certInfo.commonName : '');

  const organization = (subjectObj.O ?? subjectObj.o) as string | undefined;

  const issuer =
    certFieldToString(certInfo.issuer) ||
    (typeof certInfo.issuer === 'string' ? certInfo.issuer : '');
  const timeRaw = tsInfo.timestamp ?? sig.time ?? sig.timestamp;
  const time = typeof timeRaw === 'string' ? timeRaw : '';

  // Return undefined if no meaningful signature data (avoids empty section)
  if (!alg && !common_name && !issuer && !time) return undefined;

  return { alg, common_name, organization, issuer, time };
}

/** Read claim info from crJSON manifest.claim or manifest['claim.v2'] */
export function getClaimInfo(m: CrJsonManifestEntry): CrJsonClaimInfo {
  const claim = (m.claim ?? m['claim.v2']) as
    | Record<string, unknown>
    | undefined;
  const cgi = claim?.claim_generator_info;
  const cgiArray = Array.isArray(cgi)
    ? cgi
    : cgi != null
      ? [cgi]
      : claim?.claim_generator != null
        ? [{ name: String(claim.claim_generator) }]
        : [];

  return {
    claim_generator: claim?.claim_generator as string | undefined,
    claim_generator_info: cgiArray as CrJsonClaimInfo['claim_generator_info'],
    instance_id: (claim?.instanceID ?? claim?.instance_id) as
      | string
      | undefined,
  };
}

/** Get assertion data by label from crJSON manifest.assertions */
export function getAssertionDataByLabel(
  m: CrJsonManifestEntry,
  label: string,
): unknown {
  const assertions = m.assertions ?? {};

  return assertions[label];
}

/**
 * Get validation status for the active manifest from crJSON.
 * - Document-level (legacy/SDK): report.validationResults.activeManifest
 * - Per-manifest (c2pa-rs crJSON): report.manifests[0].validationResults (status codes directly)
 */
export function getActiveManifestValidationStatus(
  report: CrJson,
): CrJsonActiveManifestStatus | undefined {
  const docLevel = report.validationResults?.activeManifest;

  if (
    docLevel &&
    (docLevel.success?.length ?? 0) +
      (docLevel.failure?.length ?? 0) +
      (docLevel.informational?.length ?? 0) >
      0
  ) {
    return docLevel;
  }

  const firstManifest = report.manifests?.[0];
  const perManifest = firstManifest?.validationResults as
    | CrJsonValidationResults
    | undefined;

  if (
    perManifest &&
    (perManifest.success?.length ?? 0) +
      (perManifest.failure?.length ?? 0) +
      (perManifest.informational?.length ?? 0) >
      0
  ) {
    return {
      success: perManifest.success,
      informational: perManifest.informational,
      failure: perManifest.failure,
    };
  }

  return (
    docLevel ??
    (perManifest
      ? {
          success: perManifest.success,
          informational: perManifest.informational,
          failure: perManifest.failure,
        }
      : undefined)
  );
}

/**
 * Convert legacy ManifestStore (from Reader.json() / packaged SDK) to crJSON.
 * Use only when receiving legacy format; native path is already crJSON.
 */
export function legacyToCrJson(legacy: Record<string, unknown>): CrJson {
  const manifestsObj = legacy.manifests as
    | Record<string, Record<string, unknown>>
    | undefined;
  const activeLabel = legacy.active_manifest as string | undefined;
  const validationResults = (legacy.validation_results ??
    legacy.validationResults) as CrJsonValidationResults | undefined;

  const manifests: CrJsonManifestEntry[] = [];

  if (manifestsObj && typeof manifestsObj === 'object') {
    const labels = Object.keys(manifestsObj);

    // Put active manifest first (crJSON convention)
    if (activeLabel && manifestsObj[activeLabel]) {
      manifests.push(
        legacyManifestToCrJsonEntry(activeLabel, manifestsObj[activeLabel]),
      );
    }

    for (const label of labels) {
      if (label !== activeLabel && manifestsObj[label]) {
        manifests.push(legacyManifestToCrJsonEntry(label, manifestsObj[label]));
      }
    }
  }

  const cr: CrJson = {
    '@context': {
      '@vocab': 'https://contentcredentials.org/crjson',
      extras: 'https://contentcredentials.org/crjson/extras',
    },
    manifests,
  };

  if (validationResults && typeof validationResults === 'object') {
    cr.validationResults = validationResults;
    // Propagate into first manifest so per-manifest readers (and c2pa-rs-style crJSON) see it
    const activeStatus = validationResults.activeManifest ?? validationResults;

    if (
      manifests.length > 0 &&
      activeStatus &&
      typeof activeStatus === 'object'
    ) {
      manifests[0].validationResults = {
        success: (activeStatus as CrJsonActiveManifestStatus).success,
        informational: (activeStatus as CrJsonActiveManifestStatus)
          .informational,
        failure: (activeStatus as CrJsonActiveManifestStatus).failure,
      };
    }
  }

  return cr;
}

function legacyManifestToCrJsonEntry(
  label: string,
  m: Record<string, unknown>,
): CrJsonManifestEntry {
  const assertionsArray = (m.assertions ?? []) as Array<{
    label: string;
    data: unknown;
  }>;
  const assertions: Record<string, unknown> = {};

  for (const a of assertionsArray) {
    if (a?.label != null) assertions[a.label] = a.data;
  }

  const claim =
    m.claim_generator_info != null || m.instance_id != null
      ? {
          claim_generator: m.claim_generator,
          claim_generator_info: m.claim_generator_info,
          instanceID: m.instanceID ?? m.instance_id,
        }
      : undefined;
  const sig = m.signature_info as Record<string, unknown> | undefined;
  const signature = sig
    ? {
        algorithm: sig.alg ?? sig.algorithm,
        certificateInfo: {
          subject: sig.common_name ?? sig.subject,
          issuer: sig.issuer,
        },
        timeStampInfo: sig.time ? { timestamp: sig.time } : undefined,
      }
    : undefined;

  // The original Conformance Tool implementation dropped validation data for ingredients.
  // We explicitly rescue both V2 and V3 validation states here.
  const validationResults = (m.validation_results ?? m.validationResults) as
    | CrJsonValidationResults
    | undefined;
  const validationStatus = (m.validation_status ?? m.validationStatus) as
    | Record<string, unknown>
    | undefined;

  return {
    label,
    assertions,
    ...(claim && { claim: claim as Record<string, unknown> }),
    ...(signature && { signature }),
    ...(validationResults != null && { validationResults }),
    ...(validationStatus != null && { validationStatus }),
  };
}
