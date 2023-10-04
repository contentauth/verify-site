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
  import Body from '$src/components/typography/Body.svelte';
  import type { HierarchyPointNode } from 'd3-hierarchy';
  import { _ } from 'svelte-i18n';
  import { get } from 'svelte/store';
  import type {
    ReadableAssetData,
    ReadableAssetStore,
  } from '../../stores/asset';
  import AssetInfoBase from '../AssetInfo/AssetInfoBase.svelte';
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
  class={`absolute left-0 top-0 flex flex-col overflow-hidden rounded border-2 bg-white transition`}
  on:keypress={handleKeyPress($assetStore.select)}
  class:border-gray-400={$assetStore.state === 'none'}
  class:border-gray-700={$assetStore.state === 'path'}
  class:border-blue-900={$assetStore.state === 'selected'}
  {style}>
  <TreeThumbnail
    thumbnail={$assetStore.thumbnail}
    mimeType={$assetStore.mimeType} />
  <div class="pt-2" style:width={`${width}px`} aria-label={ariaLabel}>
    <AssetInfoBase assetData={$assetStore}>
      <Body slot="name"><span {title}>{title}</span></Body>
    </AssetInfoBase>
  </div>
</button>
