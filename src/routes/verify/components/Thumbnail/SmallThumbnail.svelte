<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import type { ThumbnailInfo } from '$src/lib/thumbnail';
  import ThumbnailImage, { type Fallback } from './ThumbnailImage.svelte';

  export let thumbnail: ThumbnailInfo | null;
  export let mimeType: string;
  export let highlighted = false;
  export let fallback: Fallback = null;
</script>

<div
  class="h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-gray-40 transition"
  class:ring-2={highlighted}
  class:ring-blue-800={highlighted}>
  <ThumbnailImage {thumbnail} {mimeType} {fallback} size="1.75rem" />
</div>
