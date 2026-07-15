// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

export interface RoleEntry {
  role: string;
  name: string;
}

/**
 * Dublin Core fields carried by the `cawg.metadata` assertion, mapped to a role key.
 * Per CAWG, only creator, contributor, and publisher use the dc: naming convention.
 */
const DC_ROLE_KEYS: Record<string, string> = {
  'dc:creator': 'creator',
  'dc:contributor': 'contributor',
  'dc:publisher': 'publisher',
};

/**
 * Named roles carried by the `cawg.identity` assertion's `signer_payload.role` array.
 */
const CAWG_ROLE_MAP: Record<string, string> = {
  'cawg.creator': 'creator',
  'cawg.contributor': 'contributor',
  'cawg.editor': 'editor',
  'cawg.producer': 'producer',
  'cawg.publisher': 'publisher',
  'cawg.sponsor': 'sponsor',
  'cawg.translator': 'translator',
};

function formatRoleValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value)) {
    return value
      .map((v) =>
        typeof v === 'object' && v !== null
          ? (v as { name?: string }).name || JSON.stringify(v)
          : String(v),
      )
      .filter(Boolean)
      .join(', ');
  }

  if (typeof value === 'object') {
    return (value as { name?: string }).name || JSON.stringify(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(value);
}

/**
 * Extracts CAWG named roles from a manifest, merging both supported sources:
 *
 * 1. `cawg.metadata` — Dublin Core fields (`dc:creator`, `dc:contributor`, `dc:publisher`).
 * 2. `cawg.identity` — `signer_payload.role[]` array of `cawg.*` role strings; the role
 *    holder's name is taken from the identity issuer (falling back to the manifest signer).
 *
 * Roles are de-duplicated by role key; when a role appears in both sources the
 * `cawg.metadata` name takes precedence.
 *
 * Note: assertion labels may include JUMBF hash suffixes (e.g. `cawg.metadata#xyz`),
 * so labels are matched with `startsWith`.
 */
export function selectCawgRoles(manifest: Manifest): RoleEntry[] {
  const assertionsArray = (manifest.assertions || []) as unknown[];
  type AssertionItem = { label?: string; data?: unknown };

  const rolesByKey = new Map<string, RoleEntry>();

  // Source 1: cawg.metadata dc: fields
  const metadataAssertion = assertionsArray.find((a: unknown) =>
    (a as AssertionItem).label?.startsWith('cawg.metadata'),
  ) as AssertionItem | undefined;

  if (metadataAssertion?.data && typeof metadataAssertion.data === 'object') {
    const data = metadataAssertion.data as Record<string, unknown>;

    for (const [dcKey, role] of Object.entries(DC_ROLE_KEYS)) {
      if (data[dcKey] != null) {
        const name = formatRoleValue(data[dcKey]);

        if (name) {
          rolesByKey.set(role, { role, name });
        }
      }
    }
  }

  // Source 2: cawg.identity signer_payload.role[]
  const identityAssertion = assertionsArray.find((a: unknown) =>
    (a as AssertionItem).label?.startsWith('cawg.identity'),
  ) as AssertionItem | undefined;

  if (identityAssertion?.data && typeof identityAssertion.data === 'object') {
    const data = identityAssertion.data as Record<string, unknown>;
    const signerPayload = data.signer_payload as
      | Record<string, unknown>
      | undefined;
    const signerRoles = Array.isArray(signerPayload?.role)
      ? (signerPayload?.role as unknown[])
      : [];

    const signatureInfo = data.signature_info as
      | Record<string, unknown>
      | undefined;
    const name =
      (signatureInfo?.issuer as string | undefined) ||
      manifest.signature_info?.issuer ||
      '';

    for (const raw of signerRoles) {
      const role = CAWG_ROLE_MAP[String(raw)];

      // Don't overwrite a name already resolved from cawg.metadata.
      if (role && name && !rolesByKey.has(role)) {
        rolesByKey.set(role, { role, name });
      }
    }
  }

  return Array.from(rolesByKey.values());
}
