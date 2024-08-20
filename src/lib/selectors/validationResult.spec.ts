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
        validationStatusByManifestLabel(
          [
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
          ],
          [
            'contentauth:urn:uuid:53ce0d13-8a60-42f0-8216-6e86b16a4508',
            'contentauth:urn:uuid:5b639b8e-edc1-4e41-9c8e-c87fb1e36921',
          ],
          'contentauth:urn:uuid:5b639b8e-edc1-4e41-9c8e-c87fb1e36921',
        ),
      ).toEqual({
        'contentauth:urn:uuid:5b639b8e-edc1-4e41-9c8e-c87fb1e36921': [
          {
            code: 'general.error',
            url: 'self#jumbf=/c2pa/contentauth:urn:uuid:5b639b8e-edc1-4e41-9c8e-c87fb1e36921/c2pa.signature',
            explanation: 'claim signature is not valid: CoseCertUntrusted',
          },
          {
            code: 'signingCredential.untrusted',
            url: 'Cose_Sign1',
            explanation: 'signing certificate untrusted',
          },
        ],
        'contentauth:urn:uuid:53ce0d13-8a60-42f0-8216-6e86b16a4508': [
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
        ],
      });
    });

    it.only('should handle missing claims properly', () => {
      expect(
        validationStatusByManifestLabel(
          [
            {
              code: 'signingCredential.untrusted',
              url: 'Cose_Sign1',
              explanation: 'signing certificate untrusted',
            },
            {
              code: 'claimSignature.mismatch',
              url: 'self#jumbf=/c2pa/contentauth:urn:uuid:fa71bc14-971d-4d9d-b500-039f7e321bf8/c2pa.signature',
              explanation: 'claim signature is not valid',
            },
            {
              code: 'signingCredential.untrusted',
              url: 'Cose_Sign1',
              explanation: 'signing certificate untrusted',
            },
            {
              code: 'claimSignature.mismatch',
              url: 'self#jumbf=/c2pa/contentauth:urn:uuid:256d6573-b69b-44e7-8568-4167007552ce/c2pa.signature',
              explanation: 'claim signature is not valid',
            },
            {
              code: 'assertion.hashedURI.mismatch',
              url: 'self#jumbf=c2pa.assertions/c2pa.ingredient__1',
              explanation:
                'hash does not match assertion data: self#jumbf=c2pa.assertions/c2pa.ingredient__1',
            },
            // Note the `contentbeef` here which doesn't match
            {
              code: 'claim.missing',
              url: 'self#jumbf=/c2pa/contentbeef:urn:uuid:b2940b06-aff4-4070-b7e4-926096dbda81',
              explanation: 'ingredient not found',
            },
          ],
          [
            'contentauth:urn:uuid:fa71bc14-971d-4d9d-b500-039f7e321bf8',
            'contentauth:urn:uuid:256d6573-b69b-44e7-8568-4167007552ce',
            'contentauth:urn:uuid:b2940b06-aff4-4070-b7e4-926096dbda81',
          ],
          'contentauth:urn:uuid:256d6573-b69b-44e7-8568-4167007552ce',
        ),
      ).toEqual({
        'contentauth:urn:uuid:256d6573-b69b-44e7-8568-4167007552ce': [
          {
            code: 'claim.missing',
            url: 'self#jumbf=/c2pa/contentbeef:urn:uuid:b2940b06-aff4-4070-b7e4-926096dbda81',
            explanation: 'ingredient not found',
          },
          {
            code: 'assertion.hashedURI.mismatch',
            url: 'self#jumbf=c2pa.assertions/c2pa.ingredient__1',
            explanation:
              'hash does not match assertion data: self#jumbf=c2pa.assertions/c2pa.ingredient__1',
          },
          {
            code: 'claimSignature.mismatch',
            url: 'self#jumbf=/c2pa/contentauth:urn:uuid:256d6573-b69b-44e7-8568-4167007552ce/c2pa.signature',
            explanation: 'claim signature is not valid',
          },
          {
            code: 'signingCredential.untrusted',
            url: 'Cose_Sign1',
            explanation: 'signing certificate untrusted',
          },
        ],
        'contentauth:urn:uuid:fa71bc14-971d-4d9d-b500-039f7e321bf8': [
          {
            code: 'claimSignature.mismatch',
            url: 'self#jumbf=/c2pa/contentauth:urn:uuid:fa71bc14-971d-4d9d-b500-039f7e321bf8/c2pa.signature',
            explanation: 'claim signature is not valid',
          },
          {
            code: 'signingCredential.untrusted',
            url: 'Cose_Sign1',
            explanation: 'signing certificate untrusted',
          },
        ],
      });
    });
  });
});
