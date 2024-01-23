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

export type ValidationStatus = ManifestStore['validationStatus'][0];

export type ValidationStatusCode = 'valid' | 'invalid' | 'incomplete';

export type ValidationStatusResult = ReturnType<typeof selectValidationResult>;

export const OTGP_ERROR_CODE = 'assertion.dataHash.mismatch';

export const UNTRUSTED_SIGNER_ERROR_CODE = 'signingCredential.untrusted';

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

/**
 * Determines if a validation status contains an error indicating that it has failed the trust list check.
 *
 * @param validationStatus
 * @returns `true` if it fails the trust list check
 */
export function hasUntrustedSigner(validationStatus: ValidationStatus[] = []) {
  return (
    validationStatus.filter((err) => err.code === UNTRUSTED_SIGNER_ERROR_CODE)
      .length > 0
  );
}

export function selectValidationResult(validationStatus: ValidationStatus[]) {
  const hasError = hasErrorStatus(validationStatus);
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
    hasUntrustedSigner: hasUntrustedSigner(validationStatus),
    statusCode,
  };
}
