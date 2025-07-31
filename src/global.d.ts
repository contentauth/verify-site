// Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors

declare module '@ccx-public/ingest';

declare module '@intl/adobe-locales';

declare module 'drag-drop';

declare module 'geo-coordinates-parser';

declare module 'circle-to-polygon';

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';

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
