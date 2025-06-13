// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Ingredient, Manifest } from 'c2pa';

type ReviewRating = NonNullable<
  NonNullable<Ingredient['metadata']>['reviewRatings']
>[0];

export function selectReviewRatings(manifest: Manifest) {
  const ingredientRatings = manifest.ingredients?.reduce<ReviewRating[]>(
    (acc, ingredient: Ingredient) => {
      return [...acc, ...(ingredient.metadata?.reviewRatings ?? [])];
    },
    [],
  );
  const actionRatings =
    manifest.assertions.get('c2pa.actions')[0]?.data?.metadata?.reviewRatings ??
    [];
  const reviewRatings = [...ingredientRatings, ...actionRatings];

  return {
    hasUnknownActions: reviewRatings.some((review) =>
      ['actions.unknownActionsPerformed', 'actions.possiblyMissing'].includes(
        review.code ?? '',
      ),
    ),
    wasPossiblyModified: reviewRatings.some(
      (review) => review.code === 'ingredient.possiblyModified',
    ),
  };
}
