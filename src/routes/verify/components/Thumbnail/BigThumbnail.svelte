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
  import Maximize from '$assets/svg/monochrome/maximize.svg?component';
  import ThumbnailImage from './ThumbnailImage.svelte';

  export let thumbnail: string | null;
</script>

<div class="relative h-[17.5rem] w-full max-w-[17.5rem] rounded bg-gray-100">
  <button
    data-testid="lightbox-button"
    on:click
    class="absolute inset-0 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100">
    <div
      class="absolute bottom-2.5 right-2.5 flex h-6 rounded bg-white p-1 shadow-sm">
      <Maximize />
    </div>
  </button>
  <ThumbnailImage {thumbnail} />
</div>
