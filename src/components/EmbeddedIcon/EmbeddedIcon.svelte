<!--
  ADOBE CONFIDENTIAL
  Copyright 2021 Adobe
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
  import type { ClaimGeneratorDisplayInfo } from '$src/lib/asset';
  import type { DisposableBlobUrl } from 'c2pa';
  import { onMount } from 'svelte';

  export let generator: ClaimGeneratorDisplayInfo;
  let iconUrl: string;

  onMount(() => {
    let dispose: DisposableBlobUrl['dispose'];

    if (generator.icon) {
      const result = generator.icon.getUrl();
      dispose = result.dispose;
      iconUrl = result.url;
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
