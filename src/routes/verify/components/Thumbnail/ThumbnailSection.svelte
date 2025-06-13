<!--
   Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import type { ThumbnailInfo } from '$lib/thumbnail';
  import Section from '$src/components/SidebarSection/Section.svelte';
  import BigThumbnail from './BigThumbnail.svelte';

  export let thumbnail: ThumbnailInfo | null;
  export let mimeType: string;
  export let hasBorder = true;
</script>

<Section hasBorder={false} hasPadding={false}>
  <div
    slot="content"
    class="flex justify-center border-gray-100 pb-5"
    class:border-b={hasBorder}>
    <BigThumbnail on:click {thumbnail} {mimeType} />
  </div>
</Section>
