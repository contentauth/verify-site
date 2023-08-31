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
  import type {
    ReadableAssetData,
    ReadableAssetStore,
  } from '../../stores/asset';

  export let assetStore: ReadableAssetStore;
  export let x: number;
  export let y: number;
  export let nodeWidth: number;
  export let nodeHeight: number;

  const dispatch = createEventDispatcher();

  function handleKeyPress(onKeyPress: ReadableAssetData['select']) {
    return (evt: KeyboardEvent) => {
      if (['Space', 'Enter'].includes(evt.code)) {
        onKeyPress();
      }
    };
  }

  function handleMobileTap() {
    dispatch('mobileTap');
  }
</script>

<g transform={`translate(${x}, ${y})`}>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <rect
    tabindex="0"
    on:click={$assetStore.select}
    on:keypress={handleKeyPress($assetStore.select)}
    height={nodeHeight}
    width={nodeWidth}
    x={-nodeWidth / 2}
    y={-nodeHeight / 2}
    rx={6}
    ry={6}
    class="cursor-pointer fill-current text-gray-300 focus:outline-blue-300" />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <rect
    on:click={() => {
      handleMobileTap();
      $assetStore.select();
    }}
    height={nodeHeight}
    width={nodeWidth}
    x={-nodeWidth / 2}
    y={-nodeHeight / 2}
    rx={6}
    ry={6}
    class="cursor-pointer fill-transparent sm:hidden" />
</g>
