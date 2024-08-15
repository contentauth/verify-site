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
import {
  selectValidationResult,
  validationStatusByManifestLabel,
} from './validationResult';

describe('lib/selectors/validationResult', () => {
  describe('selectValidationResult()', () => {
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
            code: 'general.error',
            url: 'self#jumbf=/c2pa/36dbdae2-c118-4cb9-a9ab-34518f7d61c9/c2pa.signature',
            explanation: 'claim signature is not valid: CoseCertUntrusted',
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
            code: 'general.error',
            url: 'self#jumbf=/c2pa/36dbdae2-c118-4cb9-a9ab-34518f7d61c9/c2pa.signature',
            explanation: 'claim signature is not valid: CoseCertUntrusted',
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
            code: 'general.error',
            url: 'self#jumbf=/c2pa/36dbdae2-c118-4cb9-a9ab-34518f7d61c9/c2pa.signature',
            explanation: 'claim signature is not valid: CoseCertUntrusted',
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
            code: 'general.error',
            url: 'self#jumbf=/c2pa/36dbdae2-c118-4cb9-a9ab-34518f7d61c9/c2pa.signature',
            explanation: 'claim signature is not valid: CoseCertUntrusted',
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

    it('should work for OTGP assets', () => {
      expect(
        selectValidationResult([
          {
            code: 'signingCredential.untrusted',
            url: 'Cose_Sign1',
            explanation: 'signing certificate untrusted',
          },
          {
            code: 'general.error',
            url: 'self#jumbf=/c2pa/36dbdae2-c118-4cb9-a9ab-34518f7d61c9/c2pa.signature',
            explanation: 'claim signature is not valid: CoseCertUntrusted',
          },
          {
            code: 'assertion.dataHash.mismatch',
            url: 'self#jumbf=/c2pa/contentauth:urn:uuid:ccdb2880-05dc-4dd4-84d9-292a0e74b2b6/c2pa.assertions/c2pa.hash.data',
            explanation:
              'asset hash error, name: jumbf manifest, error: hash verification( Hashes do not match )',
          },
        ]),
      ).toEqual({
        hasError: false,
        hasOtgp: true,
        hasUntrustedSigner: true,
        statusCode: 'incomplete',
      });
    });

    it('should strip out success error codes', () => {
      expect(
        selectValidationResult([
          {
            code: 'assertion.hashedURI.match',
            url: 'self#jumbf=/c2pa/adobe:urn:uuid:5d75c0b0-2afc-4a12-86ad-95078cbe9fc5/c2pa.assertions/c2pa.thumbnail.claim.jpeg',
          },
          {
            code: 'assertion.hashedURI.match',
            url: 'self#jumbf=/c2pa/adobe:urn:uuid:5d75c0b0-2afc-4a12-86ad-95078cbe9fc5/c2pa.assertions/c2pa.thumbnail.ingredient.jpeg',
          },
          {
            code: 'assertion.hashedURI.match',
            url: 'self#jumbf=/c2pa/adobe:urn:uuid:5d75c0b0-2afc-4a12-86ad-95078cbe9fc5/c2pa.assertions/c2pa.ingredient',
          },
          {
            code: 'assertion.hashedURI.match',
            url: 'self#jumbf=/c2pa/adobe:urn:uuid:5d75c0b0-2afc-4a12-86ad-95078cbe9fc5/c2pa.assertions/stds.schema-org.CreativeWork',
          },
          {
            code: 'assertion.hashedURI.match',
            url: 'self#jumbf=/c2pa/adobe:urn:uuid:5d75c0b0-2afc-4a12-86ad-95078cbe9fc5/c2pa.assertions/c2pa.actions',
          },
          {
            code: 'assertion.hashedURI.match',
            url: 'self#jumbf=/c2pa/adobe:urn:uuid:5d75c0b0-2afc-4a12-86ad-95078cbe9fc5/c2pa.assertions/c2pa.hash.data',
          },
          {
            code: 'timeStamp.trusted',
            url: 'self#jumbf=/c2pa/adobe:urn:uuid:5d75c0b0-2afc-4a12-86ad-95078cbe9fc5/c2pa.signature',
          },
          {
            code: 'signingCredential.trusted',
            url: 'self#jumbf=/c2pa/adobe:urn:uuid:5d75c0b0-2afc-4a12-86ad-95078cbe9fc5/c2pa.signature',
          },
          {
            code: 'claimSignature.validated',
            url: 'self#jumbf=/c2pa/adobe:urn:uuid:5d75c0b0-2afc-4a12-86ad-95078cbe9fc5/c2pa.signature',
          },
          {
            code: 'assertion.dataHash.match',
            url: 'self#jumbf=/c2pa/adobe:urn:uuid:5d75c0b0-2afc-4a12-86ad-95078cbe9fc5/c2pa.assertions/c2pa.hash.data',
          },
        ]),
      ).toEqual({
        hasError: false,
        hasOtgp: false,
        hasUntrustedSigner: false,
        statusCode: 'valid',
      });
    });
  });

  describe('validationStatusByManifestLabel()', () => {
    it('should nest multiple statuses properly', () => {
      expect(
        validationStatusByManifestLabel([
          {
            code: 'signingCredential.untrusted',
            url: 'Cose_Sign1',
            explanation: 'signing certificate untrusted',
          },
          {
            code: 'general.error',
            url: 'self#jumbf=/c2pa/contentauth:urn:uuid:53ce0d13-8a60-42f0-8216-6e86b16a4508/c2pa.signature',
            explanation: 'claim signature is not valid: CoseCertUntrusted',
          },
          {
            code: 'signingCredential.untrusted',
            url: 'Cose_Sign1',
            explanation: 'signing certificate untrusted',
          },
          {
            code: 'general.error',
            url: 'self#jumbf=/c2pa/contentauth:urn:uuid:5b639b8e-edc1-4e41-9c8e-c87fb1e36921/c2pa.signature',
            explanation: 'claim signature is not valid: CoseCertUntrusted',
          },
        ]),
      ).toEqual({
        'contentauth:urn:uuid:5b639b8e-edc1-4e41-9c8e-c87fb1e36921': {
          code: 'general.error',
          url: 'self#jumbf=/c2pa/contentauth:urn:uuid:5b639b8e-edc1-4e41-9c8e-c87fb1e36921/c2pa.signature',
          explanation: 'claim signature is not valid: CoseCertUntrusted',
          causes: [
            {
              code: 'signingCredential.untrusted',
              url: 'Cose_Sign1',
              explanation: 'signing certificate untrusted',
            },
          ],
        },
        'contentauth:urn:uuid:53ce0d13-8a60-42f0-8216-6e86b16a4508': {
          code: 'general.error',
          url: 'self#jumbf=/c2pa/contentauth:urn:uuid:53ce0d13-8a60-42f0-8216-6e86b16a4508/c2pa.signature',
          explanation: 'claim signature is not valid: CoseCertUntrusted',
          causes: [
            {
              code: 'signingCredential.untrusted',
              url: 'Cose_Sign1',
              explanation: 'signing certificate untrusted',
            },
          ],
        },
      });
    });
  });
});
