// ADOBE CONFIDENTIAL
// Copyright 2024 Adobe
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

import { describe, expect, it } from 'vitest';
import { selectValidationResult } from './validationResult';

describe('lib/selectors/validationResult', () => {
  it('should give the correct validation results', () => {
    expect(selectValidationResult([])).toEqual({
      hasError: false,
      hasOtgp: false,
      hasUntrustedSigner: false,
      statusCode: 'valid',
    });

    expect(
      selectValidationResult([
        {
          code: 'signingCredential.untrusted',
          url: 'Cose_Sign1',
          explanation: 'signing certificate untrusted',
        },
        {
          code: 'claimSignature.mismatch',
          url: 'self#jumbf=/c2pa/urn:uuid:d608f469-4cd0-4aa4-81c5-afbe33c7f291/c2pa.signature',
          explanation: 'claim signature is not valid',
        },
      ]),
    ).toEqual({
      hasError: false,
      hasOtgp: false,
      hasUntrustedSigner: true,
      statusCode: 'valid',
    });

    expect(
      selectValidationResult([
        {
          code: 'signingCredential.untrusted',
          url: 'Cose_Sign1',
          explanation: 'signing certificate untrusted',
        },
        {
          code: 'claimSignature.mismatch',
          url: 'self#jumbf=/c2pa/urn:uuid:d608f469-4cd0-4aa4-81c5-afbe33c7f291/c2pa.signature',
          explanation: 'claim signature is not valid',
        },
        {
          code: 'assertion.hashedURI.mismatch',
          url: 'self#jumbf=c2pa.assertions/c2pa.ingredient__1',
          explanation:
            'hash does not match assertion data: self#jumbf=c2pa.assertions/c2pa.ingredient__1',
        },
      ]),
    ).toEqual({
      hasError: true,
      hasOtgp: false,
      hasUntrustedSigner: true,
      statusCode: 'invalid',
    });

    expect(
      selectValidationResult([
        {
          code: 'claimSignature.mismatch',
          url: 'self#jumbf=/c2pa/urn:uuid:d608f469-4cd0-4aa4-81c5-afbe33c7f291/c2pa.signature',
          explanation: 'claim signature is not valid',
        },
        {
          code: 'assertion.hashedURI.mismatch',
          url: 'self#jumbf=c2pa.assertions/c2pa.ingredient__1',
          explanation:
            'hash does not match assertion data: self#jumbf=c2pa.assertions/c2pa.ingredient__1',
        },
      ]),
    ).toEqual({
      hasError: true,
      hasOtgp: false,
      hasUntrustedSigner: false,
      statusCode: 'invalid',
    });

    expect(
      selectValidationResult([
        {
          code: 'claimSignature.mismatch',
          url: 'self#jumbf=/c2pa/urn:uuid:d608f469-4cd0-4aa4-81c5-afbe33c7f291/c2pa.signature',
          explanation: 'claim signature is not valid',
        },
      ]),
    ).toEqual({
      hasError: true,
      hasOtgp: false,
      hasUntrustedSigner: false,
      statusCode: 'invalid',
    });

    expect(
      selectValidationResult([
        {
          code: 'signingCredential.untrusted',
          url: 'Cose_Sign1',
          explanation: 'signing certificate untrusted',
        },
      ]),
    ).toEqual({
      hasError: false,
      hasOtgp: false,
      hasUntrustedSigner: true,
      statusCode: 'valid',
    });
  });
});
