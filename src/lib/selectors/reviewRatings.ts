// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Ingredient, Manifest } from '@contentauth/c2pa-web';

type ReviewRating = NonNullable<
  NonNullable<Ingredient['metadata']>['reviewRatings']
>[0];

export function selectReviewRatings(manifest: Manifest) {
  const ingredientRatings = (manifest.ingredients ?? []).reduce<ReviewRating[]>(
    (acc, ingredient: Ingredient) => {
      return [...acc, ...(ingredient.metadata?.reviewRatings ?? [])];
    },
    [],
  );
  interface InferenceAssertion {
    data?: {
      metadata?: {
        reviewRatings?: ReviewRating[];
      };
    };
    metadata?: {
      reviewRatings?: ReviewRating[];
    };
  }
  const assertionsArray = (manifest.assertions || []) as unknown[];
  type AssItem = { label?: string; data?: unknown };
  
  const actionsAss = assertionsArray.find((a: unknown) => (a as AssItem).label === 'c2pa.actions' || (a as AssItem).label === 'c2pa.actions.v2') as InferenceAssertion | undefined;
  const actionRatings = actionsAss?.data?.metadata?.reviewRatings || actionsAss?.metadata?.reviewRatings || (actionsAss as unknown as Record<string, unknown>)?.actions?.[0]?.parameters?.reviewRatings || [];
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
