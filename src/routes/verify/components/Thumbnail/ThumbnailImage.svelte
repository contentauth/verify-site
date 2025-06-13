<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts" context="module">
  export type Fallback = ComponentType<
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    SvelteComponentTyped<SVGAttributes<SVGSVGElement>, any, any>
  > | null;
</script>

<script lang="ts">
  import AudioFallback from '$assets/svg/monochrome/missing-thumb-audio.svg?component';
  import ImageFallback from '$assets/svg/monochrome/missing-thumb-image.svg?component';
  import VideoFallback from '$assets/svg/monochrome/missing-thumb-video.svg?component';
  import { getMediaCategoryFromMimeType } from '$lib/asset';
  import type { MediaCategory } from '$lib/formats';
  import type { ThumbnailInfo } from '$lib/thumbnail';
  import Body from '$src/components/typography/Body.svelte';
  import type { ComponentType, SvelteComponentTyped } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { SVGAttributes } from 'svelte/elements';

  export let thumbnail: ThumbnailInfo | null;
  export let mimeType: string;
  export let size = '4rem';
  export let showMissingText = false;
  export let fallback: Fallback = null;

  const dispatch = createEventDispatcher();
  let thumbnailError = false;

  const fallbackMap: Record<MediaCategory, ComponentType> = {
    audio: AudioFallback,
    image: ImageFallback,
    video: VideoFallback,
    document: ImageFallback,
    unknown: ImageFallback,
  };

  $: category = getMediaCategoryFromMimeType(mimeType);
  $: alt = thumbnail ? '' : $_('page.verify.emptyThumbnail');
  $: fallbackComponent = fallback || fallbackMap[category];

  function handleImageError() {
    thumbnailError = true;
    dispatch('imageLoadingError');
    console.error('Error loading thumbnail:', thumbnail);
  }
</script>

{#if thumbnail?.url && !thumbnailError}
  <img
    src={thumbnail.url}
    on:error={handleImageError}
    class="h-full w-full object-contain"
    {alt} />
{:else}
  <div
    role="img"
    class="flex h-full w-full select-none flex-col items-center justify-center bg-gray-40">
    <svelte:component
      this={fallbackComponent}
      width={size}
      height={size}
      class="text-gray-900" />
    {#if showMissingText}
      <Body>{$_('page.verify.noThumbnailAvailable')}</Body>
    {/if}
  </div>
{/if}
