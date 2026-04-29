// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

import type { Manifest } from '@contentauth/c2pa-web';

export function selectDoNotTrain(manifest: Manifest): boolean {
  // Check for the explicit do not train/mine assertion
  const trainingAssertions = manifest.assertions?.['c2pa.training-mining'];
  if (trainingAssertions) {
    const entry = (trainingAssertions as any)?.data?.entries?.find((e: any) => 
      e.use === 'notAllowed' && (e.c2pa_manifest === true || e.c2pa_manifest === 'true')
    );
    return !!entry;
  }

  // Fallback: Check c2pa.actions for specific 'not_trained' markers
  const actionsAssertion = manifest.assertions?.['c2pa.actions'];
  const actions = (actionsAssertion as any)?.data?.actions || [];
  return actions.some((a: any) => a.action === 'c2pa.not_trained');
}
