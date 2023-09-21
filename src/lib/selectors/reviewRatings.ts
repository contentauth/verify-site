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
