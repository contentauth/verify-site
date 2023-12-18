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
  import type { ThumbnailInfo } from '$src/lib/thumbnail';
  import ThumbnailImage from './ThumbnailImage.svelte';

  export let thumbnail: ThumbnailInfo | null = null;
  export let mimeType: string;
</script>

<div class="h-full w-full">
  <ThumbnailImage {thumbnail} {mimeType} />
</div>
