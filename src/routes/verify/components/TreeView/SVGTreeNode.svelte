<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
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
    class="cursor-pointer bg-transparent fill-current text-transparent focus:outline-none" />
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
    class="cursor-pointer fill-transparent focus:outline-none sm:hidden" />
</g>
