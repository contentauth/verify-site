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

import type { Loadable } from '$src/lib/types';
import { decode } from 'cbor-x';
import { flextree } from 'd3-flextree';
import { uniq, zip } from 'lodash';
import { derived, type Readable } from 'svelte/store';
import type { C2paReaderStore } from './c2paReader';

type L4ViewState = Loadable<any>;

const BASE_HEIGHT = 230;
const BASE_WIDTH = 400;

export type L4ViewStore = Readable<L4ViewState>;

export function createL4View(c2paReader: C2paReaderStore) {
  return derived(c2paReader, ($c2paReader) => {
    if ($c2paReader.state === 'success') {
      return {
        state: 'success' as const,
        ...getL4ViewData($c2paReader.l4Info),
      };
    }

    return {
      state: $c2paReader.state,
    };
  });
}

const claimFields = [
  'alg',
  'alg_soft',
  'claim_generator',
  'claim_generator_info',
  'signature',
  'dc:format',
  'instanceID',
  'dc:title',
  'redacted_assertions',
  'metadata',
];

export type AssertionDataType = 'binary' | 'cbor' | 'json' | 'uuid';

export interface SizeSummary {
  claimSize: number;
  assertionSize: number;
  signatureSize: number;
  vcSize: number;
  databoxSize: number;
  total: number;
}

export interface ParsedAssertion {
  type: AssertionDataType;
  data: Blob;
  size: number;
  parsed?: any;
}

function parseAssertionData(
  data: Record<string, any>,
  contentType: string,
): ParsedAssertion | null {
  if (data?.Binary) {
    const blob = new Blob([new Uint8Array(data.Binary)], { type: contentType });

    return {
      type: 'binary',
      data: blob,
      size: blob.size,
    };
  } else if (data?.Cbor) {
    const buffer = new Uint8Array(data.Cbor);
    const blob = new Blob([buffer], { type: contentType });

    return {
      type: 'cbor',
      data: blob,
      parsed: decode(buffer),
      size: blob.size,
    };
  } else if (data?.Json) {
    const blob = new Blob([data?.Json ?? '']);

    return {
      type: 'json',
      data: data?.Json,
      parsed: JSON.parse(data?.Json),
      size: blob.size,
    };
  } else if (data?.Uuid) {
    const blob = new Blob([new Uint8Array(data.Uuid)], { type: contentType });

    return {
      type: 'uuid',
      data: blob,
      size: blob.size,
    };
  }

  console.error('Unknown assertion handler for', data);

  return null;
}

function formatClaim(claimData: any) {
  const {
    claim,
    uri,
    signature_info: signatureInfo,
    signature_size: signatureSize,
    size: claimSize,
  } = claimData;
  const formattedClaim = claimFields.reduce<Record<string, any>>(
    (acc, field) => {
      acc[field] = claim[field] ?? null;

      return acc;
    },
    {},
  );
  formattedClaim.ref = [uri, 'claim'];

  const mergedAssertions = zip(claim.assertions, claim.assertion_store);
  const assertions = mergedAssertions.map(
    ([{ url: assertionUri }, assertionStore]: any) => {
      const { assertion, hash_alg: hashAlg, instance } = assertionStore;
      const { content_type: contentType, data, label, version } = assertion;

      return {
        ref: [uri, 'assertions', label, 'label'],
        uri: assertionUri,
        label,
        ...parseAssertionData(data, contentType),
        version: version ?? 1,
        instance,
        hashAlg,
      };
    },
  );

  const ingredients = assertions
    .filter((assertion) => assertion.label === 'c2pa.ingredient')
    .map((ingredient) => {
      return {
        ...ingredient,
        manifestUri: ingredient.parsed?.c2pa_manifest?.url ?? null,
      };
    });

  const ingredientsWithClaims = ingredients.filter(
    (ingredient) => !!ingredient.manifestUri,
  );

  const verifiableCredentials = claim.vc_store.map(
    ([{ uri: vcUri }, data]: [any, any]) => {
      return {
        uri: vcUri,
        ref: [uri, 'verifiableCredentials', vcUri],
        ...parseAssertionData(data, 'application/json'),
      };
    },
  );

  const [assertionSize, vcSize] = [assertions, verifiableCredentials].map((x) =>
    x.reduce((acc: number, curr: any) => (acc += curr.size), 0),
  );

  const sizeBreakdown: Omit<SizeSummary, 'total'> = {
    claimSize,
    assertionSize,
    signatureSize,
    vcSize,
    // TODO: Get databoxes
    databoxSize: 0,
  };
  const dataSize: SizeSummary = {
    ...sizeBreakdown,
    total: Object.values(sizeBreakdown).reduce((acc, curr) => (acc += curr), 0),
  };

  const uniqueAssertionLabels = uniq(assertions.map((a) => a.label));
  const padding = [50, 10];
  const width = BASE_WIDTH + padding[1] * 2;
  const height =
    BASE_HEIGHT + uniqueAssertionLabels.length * 40 + padding[0] * 2;

  return {
    ref: [uri],
    uri,
    claim: formattedClaim,
    dataSize,
    // We are reversing width and height to make this horizontal
    size: [height, width],
    padding,
    assertions,
    ingredients,
    ingredientsWithClaims,
    verifiableCredentials,
    signatureInfo: {
      ref: [uri, 'signatureInfo'],
      ...signatureInfo,
    },
  };
}

function getL4ViewData(data: any) {
  const layout = flextree({
    spacing: 0,
  });
  const { claims, active_manifest: activeManifest } = data;
  const root = claims.find((x: any) => x.claim.label === activeManifest);

  const hierarchy = layout.hierarchy(formatClaim(root), (claim: any) => {
    return (
      claim.ingredientsWithClaims?.map((ingredient: any) => {
        return formatClaim(
          claims.find((c: any) => c.uri === ingredient.manifestUri),
        );
      }) ?? []
    );
  });

  const tree = layout(hierarchy);

  return {
    hierarchy,
    tree,
  };
}
