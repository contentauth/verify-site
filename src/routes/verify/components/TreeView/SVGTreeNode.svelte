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
  import { createEventDispatcher } from 'svelte';
  import type { ReadableAssetStore } from '../../stores/asset';

  export let assetStore: ReadableAssetStore;
  export let x: number;
  export let y: number;
  export let nodeWidth: number;
  export let nodeHeight: number;

  const dispatch = createEventDispatcher();

  function handleMobileTap() {
    dispatch('mobileTap');
  }
</script>

<g transform={`translate(${x}, ${y})`}>
  <!-- Key events are handled in TreeNode -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <rect
    tabindex="-1"
    role="button"
    on:click={$assetStore.select}
    height={nodeHeight}
    width={nodeWidth}
    x={-nodeWidth / 2}
    y={-nodeHeight / 2}
    rx={6}
    ry={6}
    class="cursor-pointer fill-current text-gray-300 focus:outline-none" />
  <!-- Key events are handled in TreeNode -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <rect
    on:click={() => {
      handleMobileTap();
      $assetStore.select();
    }}
    tabindex="-1"
    role="button"
    height={nodeHeight}
    width={nodeWidth}
    x={-nodeWidth / 2}
    y={-nodeHeight / 2}
    rx={6}
    ry={6}
    class="cursor-pointer fill-transparent sm:hidden focus:outline-none" />
</g>
