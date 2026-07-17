// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

export interface RoleEntry {
  role: string;
  name: string;
}

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

/**
 * Extracts CAWG named roles from the `cawg.identity` assertion.
 *
 * Reads `signer_payload.role[]` (array of `cawg.*` role strings); the role
 * holder's name is taken from the identity issuer (falling back to the manifest signer).
 *
 * Note: assertion labels may include JUMBF hash suffixes (e.g. `cawg.identity#xyz`),
 * so labels are matched with `startsWith`.
 */
export function selectCawgRoles(manifest: Manifest): RoleEntry[] {
  const assertionsArray = (manifest.assertions || []) as unknown[];
  type AssertionItem = { label?: string; data?: unknown };

  const roles: RoleEntry[] = [];

  // Source: cawg.identity signer_payload.role[]
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

      if (role && name) {
        roles.push({ role, name });
      }
    }
  }

  return roles;
}
