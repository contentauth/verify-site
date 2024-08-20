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

export const GENERAL_ERROR_CODE = 'general.error';

export const OTGP_ERROR_CODE = 'assertion.dataHash.mismatch';

export const UNTRUSTED_SIGNER_ERROR_CODE = 'signingCredential.untrusted';

export const SUCCESS_CODES = [
  'claimSignature.validated',
  'signingCredential.trusted',
  'signingCredential.notRevoked',
  'timeStamp.trusted',
  'assertion.hashedURI.match',
  'assertion.dataHash.match',
  'assertion.bmffHash.match',
  'assertion.boxesHash.match',
  'assertion.accessible',
];

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
  UntrustedOnly,
  UntrustedWithOtgp,
  UntrustedWithOtherErrors,
  TrustedWithOtgp,
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
    [UNTRUSTED_SIGNER_ERROR_CODE, GENERAL_ERROR_CODE].includes(code),
  );
  const others = difference(codes, filtered);
  const hasUntrusted = filtered.includes(UNTRUSTED_SIGNER_ERROR_CODE);

  // Return false if we have other errors, since that should be regarded as an error
  if (others.length) {
    // If the other error is the OTGP error code, make sure we account for that
    if (others.length === 1 && others[0] === OTGP_ERROR_CODE) {
      return hasUntrusted
        ? UntrustedSignerResult.UntrustedWithOtgp
        : UntrustedSignerResult.TrustedWithOtgp;
    }

    return hasUntrusted
      ? UntrustedSignerResult.UntrustedWithOtherErrors
      : UntrustedSignerResult.TrustedWithErrors;
  }

  // If we are untrusted and also have a signature mismatch, report as untrusted only
  // Since we don't want to show an error message with this since this is a subset of
  // the signature mismatch error.
  if (hasUntrusted && filtered.length === 2) {
    return UntrustedSignerResult.UntrustedOnly;
  }

  // If we only get a signature mismatch, report that as an error
  if (!hasUntrusted && filtered.length) {
    return UntrustedSignerResult.TrustedWithErrors;
  }

  return hasUntrusted
    ? // Untrusted without any other errors
      UntrustedSignerResult.UntrustedOnly
    : // Not untrusted and no errors
      UntrustedSignerResult.TrustedOnly;
}

export function selectValidationResult(validationStatus: ValidationStatus[]) {
  const onlyErrors = validationStatus.filter(
    (status) => !SUCCESS_CODES.includes(status.code),
  );
  const untrustedResult = hasUntrustedSigner(onlyErrors);
  const hasError =
    hasErrorStatus(onlyErrors) &&
    [
      UntrustedSignerResult.UntrustedWithOtherErrors,
      UntrustedSignerResult.TrustedWithErrors,
    ].includes(untrustedResult);
  const hasOtgp = hasOtgpStatus(onlyErrors);
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
      UntrustedSignerResult.UntrustedOnly,
      UntrustedSignerResult.UntrustedWithOtgp,
      UntrustedSignerResult.UntrustedWithOtherErrors,
    ].includes(untrustedResult),
    statusCode,
  };
}

const jumbfUriRegExp = /^self#jumbf=\/c2pa\/([^/]+)\/?(.*)$/i;

export function extractManifestLabelFromJumbfUri(uri: string) {
  return jumbfUriRegExp.exec(uri)?.[1] ?? null;
}

export type ManifestLabelValidationStatusMap = Record<
  string,
  ValidationStatus[]
>;

interface ValidationStatusReducer {
  reduced: ManifestLabelValidationStatusMap;
  currentKey: string | null;
}

/**
 * This function parses the runtime validation status list, which exists in the root of the `manifestStore` object.
 *
 * The way the validation status list is sorted from c2pa-rs is that any entry without a `url` that is a manifest
 * label is attributed to its "parent" error that has one. The "parent" error will come _after_ the originating error
 * due to the traversal path when c2pa-rs validates a manifest.
 *
 * Sometimes, URLs may reference labels that don't exist in the case of corrupted manifests. In this case, we try to
 * attribute everything to the active manifest label. Some safeguards are also in place to make sure entries that
 * don't have a label for whatever reason get attributed to the active manifest.
 *
 * **IMPORTANT:** Please update the tests in `validationResult.spec.ts` if making any changes to this function.
 *
 * @param validationStatus The runtime validation status on the root of the manifest
 * @param allLabels
 * @param activeManifestLabel
 * @returns
 */
export function validationStatusByManifestLabel(
  validationStatus: ValidationStatus[],
  allLabels: string[],
  activeManifestLabel: string,
): ManifestLabelValidationStatusMap {
  const { reduced } = [...validationStatus]
    // Reverse this so we don't have to look forward for the associated URLs
    .reverse()
    .reduce<ValidationStatusReducer>(
      (acc, curr) => {
        // Try to see if this entry has a label in the URL to associate the validation status with
        const label = extractManifestLabelFromJumbfUri(curr.url ?? '');

        if (label) {
          // If this label exists in the manifest store, use it. If not, attribute to the active manifest.
          const currentKey = allLabels.includes(label)
            ? label
            : activeManifestLabel;

          return {
            reduced: {
              ...acc.reduced,
              [currentKey]: [...(acc.reduced[currentKey] ?? []), curr],
            },
            currentKey,
          };
        } else if (acc.currentKey) {
          // If we previously parsed a status with a valid label, use that
          acc.reduced[acc.currentKey].push(curr);
        } else {
          // If we don't have anything to go off of and no previous label, add to active manifest errors
          acc.reduced[activeManifestLabel] = [
            ...(acc.reduced[activeManifestLabel] ?? []),
            curr,
          ];
        }

        return acc;
      },
      { reduced: {}, currentKey: null },
    );

  return reduced;
}
