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
  type ActionsReviewAssertion = { data?: { metadata?: { reviewRatings?: ReviewRating[] } } };
  const assertions = manifest.assertions;
  let actionsAssertion: unknown;

  if (Array.isArray(assertions)) {
    actionsAssertion = assertions.find(
      (a): a is { label: string; data: unknown } =>
        typeof a === 'object' &&
        a !== null &&
        'label' in a &&
        typeof (a as Record<string, unknown>)['label'] === 'string' &&
        (a as Record<string, unknown>)['label'] === 'c2pa.actions'
    );
  } else if (assertions && typeof assertions === 'object') {
    actionsAssertion = (assertions as Record<string, unknown>)['c2pa.actions'];
  }

  const actionRatings =
    (actionsAssertion as ActionsReviewAssertion)?.data?.metadata?.reviewRatings ?? [];
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
