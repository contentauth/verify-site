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
  import L1Icon from '$assets/svg/monochrome/cr-icon-white-fill.svg';
  import type { HierarchyPointNode } from 'd3-hierarchy';
  import { _ } from 'svelte-i18n';
  import { get } from 'svelte/store';
  import type {
    ReadableAssetData,
    ReadableAssetStore,
  } from '../../stores/asset';

  import TreeThumbnail from '../Thumbnail/TreeThumbnail.svelte';

  export let assetStore: ReadableAssetStore;
  export let x: number;
  export let y: number;
  export let width: number;
  export let height: number;
  export let parent: HierarchyPointNode<ReadableAssetStore> | null;

  $: tx = x - width / 2;
  $: ty = y - height / 2;
  $: style = `width: ${width}px; height: ${height}px; transform: translate3d(${tx}px, ${ty}px, 0)`;
  $: title = $assetStore.title ?? $_('asset.defaultTitle');
  $: hasContentCredentials = $assetStore.manifestData
    ? $_('page.verify.hasCC.date', {
        values: { date: $assetStore.manifestData?.date },
      })
    : $_('sidebar.verify.noCC');
  $: parentData = parent?.data ? get(parent?.data) : null;
  $: parentTitle = parentData?.title;
  $: parentLabel =
    parent == null
      ? $_('sidebar.verify.compare.root')
      : $_('sidebar.verify.compare.child', {
          values: { parentTitle },
        });
  $: ariaLabel = $_('page.verify.treeNode.ariaLabel', {
    values: { title, hasContentCredentials, parentLabel },
  });
  $: removeL1 = true;
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
  class="absolute left-0 top-0 flex flex-col overflow-hidden rounded border-2 bg-gray-40 transition-all focus:shadow motion-reduce:transition-none"
  on:keypress={handleKeyPress($assetStore.select)}
  class:border-gray-400={$assetStore.state === 'none'}
  class:border-gray-700={$assetStore.state === 'path'}
  class:border-blue-900={$assetStore.state === 'selected'}
  {style}>
  <TreeThumbnail
    thumbnail={$assetStore.thumbnail}
    mimeType={$assetStore.mimeType} />
  <div
    aria-label={ariaLabel}
    class="absolute ms-2 mt-2 flex items-center rounded-full bg-white pe-2 ps-0.5 pt-0.5 shadow-md"
    class:bg-transparent={removeL1}
    class:shadow-none={removeL1}
    class:rounded-none={removeL1}>
    <img
      src={L1Icon}
      alt=""
      width="1rem"
      height="1rem"
      class="me-2 h-4 w-4 text-gray-900" />
    <!-- <L1Icon width="1rem" height="1rem" class="me-2 h-4 w-4 text-gray-900" /> -->
    <span class="text-body text-gray-900" class:hidden={removeL1}
      >Mar 1, 2022</span>
  </div>
</button>
