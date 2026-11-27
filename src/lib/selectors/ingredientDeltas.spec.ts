// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import { describe, expect, it } from 'vitest';
import { deltaFailures, ingredientDeltasFor, type ValidationDelta } from './ingredientDeltas';

// Shape of `validation_results.ingredientDeltas` for a Photoshop 28 Generative Expand export
// validated against the C2PA Trust List only: ingredient 0 is the opened JPEG (no provenance),
// ingredient 1 is the Adobe Firefly manifest, whose signer is not on the C2PA Trust List.
const ACTIVE = 'urn:c2pa:940e7e27-0407-48b2-991b-1a95a5e49fdb';
const FIREFLY = 'urn:c2pa:5a0d23f9-9cfc-4fc3-90ef-e4b821847622';
const deltas: ValidationDelta[] = [
  {
    ingredientAssertionURI: `self#jumbf=/c2pa/${ACTIVE}/c2pa.assertions/c2pa.ingredient.v3`,
    validationDeltas: { failure: [] },
  },
  {
    ingredientAssertionURI: `self#jumbf=/c2pa/${ACTIVE}/c2pa.assertions/c2pa.ingredient.v3__1`,
    validationDeltas: {
      failure: [{ code: 'signingCredential.untrusted' }],
    },
  },
];

const codes = (manifest: string, ingredient?: string) =>
  deltaFailures(ingredientDeltasFor(deltas, manifest, ingredient)).map((s) => s.code);

describe('lib/selectors/ingredientDeltas', () => {
  it("returns each ingredient's own delta, not the manifest's first one", () => {
    expect(codes(ACTIVE, 'c2pa.ingredient.v3')).toEqual([]);
    expect(codes(ACTIVE, 'c2pa.ingredient.v3__1')).toEqual(['signingCredential.untrusted']);
  });

  it('does not let c2pa.ingredient.v3 match c2pa.ingredient.v3__1', () => {
    expect(ingredientDeltasFor(deltas, ACTIVE, 'c2pa.ingredient.v3')).toHaveLength(1);
  });

  it("falls back to all of the manifest's ingredient deltas when the label is unknown", () => {
    expect(codes(ACTIVE)).toEqual(['signingCredential.untrusted']);
  });

  it('returns nothing for a manifest with no deltas', () => {
    expect(codes(FIREFLY, 'c2pa.ingredient.v3')).toEqual([]);
  });
});
