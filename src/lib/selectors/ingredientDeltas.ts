// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

export type ValidationStatus = { code: string };
export type ValidationDelta = {
  ingredientAssertionURI?: string;
  validationDeltas?: { failure?: ValidationStatus[] };
};

/**
 * The ingredient deltas that belong to one ingredient assertion of one manifest.
 *
 * Delta URIs look like `self#jumbf=/c2pa/<manifest label>/c2pa.assertions/<ingredient label>`,
 * e.g. `.../c2pa.assertions/c2pa.ingredient.v3__1` for a manifest's second ingredient. Matching
 * on the manifest label alone would return the manifest's *first* ingredient's delta for every
 * ingredient.
 *
 * When the ingredient's assertion label is unknown, every ingredient delta of that manifest is
 * returned, so that a trust failure on any of them errs towards "legacy" rather than "official".
 */
export function ingredientDeltasFor(
  deltas: ValidationDelta[],
  manifestLabel: string,
  ingredientLabel?: string,
): ValidationDelta[] {
  const manifestPrefix = `/${manifestLabel}/c2pa.assertions/`;

  return deltas.filter((d) => {
    const uri = d.ingredientAssertionURI;

    if (!uri) {
      return false;
    }

    if (ingredientLabel) {
      return uri.endsWith(`${manifestPrefix}${ingredientLabel}`);
    }

    return uri.includes(manifestPrefix) && uri.includes('c2pa.ingredient');
  });
}

export function deltaFailures(deltas: ValidationDelta[]): ValidationStatus[] {
  return deltas.flatMap((d) => d.validationDeltas?.failure ?? []);
}
