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

import type { ManifestStore } from 'c2pa';
import { difference } from 'lodash';

export type ValidationStatus = ManifestStore['validationStatus'][0];

export type ValidationStatusCode = 'valid' | 'invalid' | 'incomplete';

export type ValidationStatusResult = ReturnType<typeof selectValidationResult>;

export const OTGP_ERROR_CODE = 'assertion.dataHash.mismatch';

export const UNTRUSTED_SIGNER_ERROR_CODE = 'signingCredential.untrusted';

export const SIGNATURE_MISMATCH = 'claimSignature.mismatch';

/**
 * Determines if a validation status list contains an OTGP (`assertion.dataHash.mismatch`)
 * status, and therefore, should present with an orange badge.
 *
 * @param validationStatus
 * @returns `true` if we find an OTGP status
 */
export function hasOtgpStatus(validationStatus: ValidationStatus[] = []) {
  return validationStatus.some((err) => err.code === OTGP_ERROR_CODE);
}

/**
 * Determines if a validation status list contains an error (anything not in the Rust SDK's
 * `C2PA_STATUS_VALID_SET` list _and_ not an OTGP status) and therefore, should present with a red badge.
 *
 * @param validationStatus
 * @returns `true` if we find an error
 */
export function hasErrorStatus(validationStatus: ValidationStatus[] = []) {
  return (
    validationStatus.filter(
      (err) =>
        err.code !== OTGP_ERROR_CODE &&
        err.code !== UNTRUSTED_SIGNER_ERROR_CODE,
    ).length > 0
  );
}

enum UntrustedSignerResult {
  UntrustedSignerOnly,
  UntrustedSignerWithOtherErrors,
  TrustedWithErrors,
  TrustedOnly,
}

/**
 * Determines if a validation status contains an error indicating that it has failed the trust list check.
 *
 * @param validationStatus
 * @returns `true` if it fails the trust list check
 */
export function hasUntrustedSigner(
  validationStatus: ValidationStatus[] = [],
): UntrustedSignerResult {
  // Assets that can fail the untrusted signer check will have the untrusted signer error code
  // and possibly the signature mismatch code
  const codes = validationStatus.map((err) => err.code);
  const filtered = codes.filter((code) =>
    [UNTRUSTED_SIGNER_ERROR_CODE, SIGNATURE_MISMATCH].includes(code),
  );
  const others = difference(codes, filtered);
  const hasUntrusted = filtered.includes(UNTRUSTED_SIGNER_ERROR_CODE);

  // Return false if we have other errors, since that should be regarded as an error
  if (others.length) {
    return hasUntrusted
      ? UntrustedSignerResult.UntrustedSignerWithOtherErrors
      : UntrustedSignerResult.TrustedWithErrors;
  }

  // If we are untrusted and also have a signature mismatch, report as untrusted only
  // Since we don't want to show an error message with this since this is a subset of
  // the signature mismatch error.
  if (hasUntrusted && filtered.length === 2) {
    return UntrustedSignerResult.UntrustedSignerOnly;
  }

  // If we only get a signature mismatch, report that as an error
  if (!hasUntrusted && filtered.length) {
    return UntrustedSignerResult.TrustedWithErrors;
  }

  return hasUntrusted
    ? // Untrusted without any other errors
      UntrustedSignerResult.UntrustedSignerOnly
    : // Not untrusted and no errors
      UntrustedSignerResult.TrustedOnly;
}

export function selectValidationResult(validationStatus: ValidationStatus[]) {
  const untrustedResult = hasUntrustedSigner(validationStatus);
  const hasError =
    hasErrorStatus(validationStatus) &&
    [
      UntrustedSignerResult.UntrustedSignerWithOtherErrors,
      UntrustedSignerResult.TrustedWithErrors,
    ].includes(untrustedResult);
  const hasOtgp = hasOtgpStatus(validationStatus);
  let statusCode: ValidationStatusCode;

  if (hasError) {
    statusCode = 'invalid';
  } else if (hasOtgp) {
    statusCode = 'incomplete';
  } else {
    statusCode = 'valid';
  }

  return {
    hasError,
    hasOtgp,
    hasUntrustedSigner: [
      UntrustedSignerResult.UntrustedSignerOnly,
      UntrustedSignerResult.UntrustedSignerWithOtherErrors,
    ].includes(untrustedResult),
    statusCode,
  };
}
