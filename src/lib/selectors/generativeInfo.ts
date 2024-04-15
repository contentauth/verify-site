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

import {
  selectGenerativeInfo as sdkSelectGenerativeInfo,
  type Manifest,
  type GenerativeInfo as SdkGenerativeInfo,
} from 'c2pa';
import { filter, flow, uniqBy } from 'lodash/fp';

type SoftwareAgent = SdkGenerativeInfo['softwareAgent'];

export interface GenerativeInfo {
  softwareAgents: SoftwareAgent[];
  type: SdkGenerativeInfo['type'];
}

export function selectGenerativeSoftwareAgents(
  generativeInfo: SdkGenerativeInfo[],
): SoftwareAgent[] {
  const softwareAgents: SoftwareAgent[] = generativeInfo.map((assertion) => {
    return assertion?.softwareAgent;
  });

  // if there are undefined software agents remove them from the array
  return flow<[SoftwareAgent[]], SoftwareAgent[], SoftwareAgent[]>(
    filter((x) => !!x?.name),
    uniqBy((x) => x.name),
  )(softwareAgents);
}

export function selectGenerativeType(generativeInfo: SdkGenerativeInfo[]) {
  const result =
    // Try to see if we have any composite assertions
    generativeInfo.find(
      (assertion) => assertion.type === 'compositeWithTrainedAlgorithmicMedia',
      // If not, fall back to whichever one the first item is, which should be the trained or legacy assertion
    ) ?? generativeInfo[0];

  return result?.type ?? null;
}

export function selectGenerativeInfo(manifest: Manifest) {
  const generativeInfo = sdkSelectGenerativeInfo(manifest);

  if (!generativeInfo || generativeInfo?.length === 0) {
    return null;
  }

  return {
    softwareAgents: selectGenerativeSoftwareAgents(generativeInfo),
    type: selectGenerativeType(generativeInfo),
  } as GenerativeInfo;
}
