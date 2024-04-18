// ADOBE CONFIDENTIAL
// Copyright 2020 Adobe
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

declare module '@ccx-public/ingest';

declare module '@intl/adobe-locales';

declare module 'drag-drop';

declare module 'geo-coordinates-parser';

declare module 'circle-to-polygon';

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';

declare const __CURRENT_YEAR__: string;
declare const __OVERRIDE_MANIFEST_RECOVERY_BASE_URL__: string;
declare const __SUPPORTED_LOCALES__: string[];
declare const __THUMBNAIL_DATA_TYPE__: 'blob' | 'datauri';

declare module '*.svg?component' {
  import type { ComponentType, SvelteComponentTyped } from 'svelte';
  import type { SVGAttributes } from 'svelte/elements';

  const content: ComponentType<
    SvelteComponentTyped<SVGAttributes<SVGSVGElement>>
  >;

  export default content;
}
