<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import type { ClaimGeneratorDisplayInfo } from '$src/lib/asset';

  interface DisposableBlobUrl {
    url: string;
    dispose: () => void;
  }
  import { onMount } from 'svelte';

  export let generator: ClaimGeneratorDisplayInfo;
  let iconUrl: string | undefined;

  onMount(() => {
    let dispose: DisposableBlobUrl['dispose'];

    if (generator.icon) {
      // The new SDK requires the active reader instance to fetch embedded resources.
      // The legacy synchronous .getUrl() is not supported. Skipping icon render for now.
      iconUrl = undefined;
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
