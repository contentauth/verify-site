<!--
  ADOBE CONFIDENTIAL
  Copyright 2023 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->
<script lang="ts">
  import AudioFallback from '$assets/svg/monochrome/missing-thumb-audio.svg?component';
  import ImageFallback from '$assets/svg/monochrome/missing-thumb-image.svg?component';
  import VideoFallback from '$assets/svg/monochrome/missing-thumb-video.svg?component';
  import { getMediaCategoryFromMimeType } from '$lib/asset';
  import type { MediaCategory } from '$lib/formats';
  import type { ThumbnailInfo } from '$lib/thumbnail';
  import Body from '$src/components/typography/Body.svelte';
  import type { ComponentType } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  export let thumbnail: ThumbnailInfo | null;
  export let mimeType: string;
  export let size = '4rem';
  export let showMissingText = false;

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
  $: fallback = fallbackMap[category];

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
      this={fallback}
      width={size}
      height={size}
      class="text-gray-900" />
    {#if showMissingText}
      <Body>{$_('page.verify.noThumbnailAvailable')}</Body>
    {/if}
  </div>
{/if}
