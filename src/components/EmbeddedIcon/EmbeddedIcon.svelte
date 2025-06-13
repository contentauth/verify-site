<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import type { ClaimGeneratorDisplayInfo } from '$src/lib/asset';
  import { loadThumbnail } from '$src/lib/thumbnail';
  import type { DisposableBlobUrl } from 'c2pa';
  import { onMount } from 'svelte';

  export let generator: ClaimGeneratorDisplayInfo;
  let iconUrl: string | undefined;

  onMount(() => {
    let dispose: DisposableBlobUrl['dispose'];

    if (generator.icon) {
      loadThumbnail(generator.icon.contentType, generator.icon.getUrl()).then(
        (result) => {
          dispose = result.dispose;
          iconUrl = result.info?.url;
        },
      );
    }

    return () => {
      dispose?.();
    };
  });
</script>

{#if iconUrl}
  <img
    data-testid="embedded-generator-icon"
    src={iconUrl}
    class="h-4 w-4"
    alt={generator.label} />
{/if}
