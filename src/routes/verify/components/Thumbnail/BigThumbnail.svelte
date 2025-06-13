<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Maximize from '$assets/svg/monochrome/maximize.svg?component';
  import type { ThumbnailInfo } from '$src/lib/thumbnail';
  import ThumbnailImage from './ThumbnailImage.svelte';

  export let thumbnail: ThumbnailInfo | null;
  export let mimeType: string;

  $: showLightboxButton = !!thumbnail?.url;
</script>

<div
  class="relative flex h-[17.5rem] w-full rounded bg-gray-40 lg:max-w-[17.5rem]">
  {#if showLightboxButton}
    <button
      data-testid="lightbox-button"
      on:click
      class="absolute inset-0 h-full w-full opacity-0 transition-opacity hover:opacity-100 focus:opacity-100">
      <div
        class="absolute bottom-2.5 right-2.5 flex h-6 rounded bg-white p-1 shadow-sm">
        <Maximize />
      </div>
    </button>
  {/if}
  <ThumbnailImage
    {thumbnail}
    {mimeType}
    size="8rem"
    showMissingText
    on:imageLoadingError={() => (showLightboxButton = false)} />
</div>
