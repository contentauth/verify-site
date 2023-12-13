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
  import type { HierarchyPointNode } from 'd3-hierarchy';
  import type {
    ReadableAssetData,
    ReadableAssetStore,
  } from '../../stores/asset';
  import TreeThumbnail from '../Thumbnail/TreeThumbnail.svelte';
  import TreeAssetInfo from './TreeAssetInfo.svelte';

  export let assetStore: ReadableAssetStore;
  export let x: number;
  export let y: number;
  export let width: number;
  export let height: number;
  export let parent: HierarchyPointNode<ReadableAssetStore> | null;
  export let transformScale: number;

  $: tx = x - width / 2;
  $: ty = y - height / 2;
  $: borderWidth = transformScale > 0.5 ? 0.3 : 0.3 + 0.5 / transformScale / 10;
  $: style = `width: ${width}px; height: ${height}px; transform: translate3d(${tx}px, ${ty}px, 0); border-width: ${borderWidth}rem`;

  function handleKeyPress(onKeyPress: ReadableAssetData['select']) {
    return (evt: KeyboardEvent) => {
      if (['Space', 'Enter'].includes(evt.code)) {
        onKeyPress();
      }
    };
  }
</script>

<button
  role="treeitem"
  aria-selected={$assetStore.state === 'selected' ? 'true' : 'false'}
  data-testid={`tree-node-${$assetStore.id}`}
  class="absolute left-0 top-0 flex flex-col overflow-hidden rounded-3xl border-gray-400 bg-gray-40 transition-all focus:shadow motion-reduce:transition-none"
  on:keypress={handleKeyPress($assetStore.select)}
  class:border-gray-400={$assetStore.state === 'none'}
  class:border-gray-700={$assetStore.state === 'path'}
  class:border-blue-900={$assetStore.state === 'selected'}
  {style}>
  <TreeThumbnail
    thumbnail={$assetStore.thumbnail}
    mimeType={$assetStore.mimeType} />
  <TreeAssetInfo {assetStore} {parent} {transformScale} />
</button>
