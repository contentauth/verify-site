<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
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
