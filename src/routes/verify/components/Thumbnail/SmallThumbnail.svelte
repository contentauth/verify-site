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
  import ThumbnailImage from './ThumbnailImage.svelte';

  export let thumbnail: string | null;
  export let highlighted = false;
</script>

<div
  class="h-12 w-12 shrink-0 rounded-sm bg-gray-100 transition"
  class:ring-2={highlighted}
  class:ring-blue-800={highlighted}>
  <ThumbnailImage {thumbnail} />
</div>
