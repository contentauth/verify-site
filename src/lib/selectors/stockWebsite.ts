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

import type { Manifest } from 'c2pa';

export function selectWebsite(manifest: Manifest): string | null {
  const site = manifest.assertions.get('stds.schema-org.CreativeWork')[0]?.data
    .url;

  if (site) {
    const url = new URL(site);

    if (url.protocol === 'https:' && url.hostname === 'stock.adobe.com') {
      return site;
    }
  }

  return null;
}
