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
  import Compare from '$assets/svg/monochrome/compare.svg?component';
  import ZoomIn from '$assets/svg/monochrome/zoom-in.svg?component';
  import ZoomOut from '$assets/svg/monochrome/zoom-out.svg?component';
  import Body from '$src/components/typography/Body.svelte';
  import type { AssetData } from '$src/lib/asset';
  import { onMount, tick } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { Readable } from 'svelte/store';
  import {
    createTreeView,
    remToPx,
    type TreeViewConfig,
  } from '../../lib/treeView';
  import { verifyStore } from '../../stores';
  import type { ReadableAssetMap } from '../../stores/hierarchyView';
  import SvgTreeNode from './SVGTreeNode.svelte';
  import TreeLink from './TreeLink.svelte';
  import TreeNode from './TreeNode.svelte';

  export let assetStoreMap: ReadableAssetMap;
  export let selectedAsset: Readable<AssetData>;

  const nodeWidth = remToPx(10.25);
  const nodeHeight = remToPx(10.25);

  let treeView: ReturnType<typeof createTreeView>;
  let svgElement: SVGElement;
  let boundsElement: SVGGraphicsElement;
  let width = 1;
  let height = 1;

  onMount(async () => {
    const config: Partial<TreeViewConfig> = {
      nodeWidth,
      nodeHeight,
    };

    treeView = createTreeView({
      assetStoreMap,
      selectedAsset,
      config,
      svgElement,
      boundsElement,
      dims: { width, height },
    });

    // TODO: See why `boundsElement.getBBox()` is returning null values causing minScale to be `1`
    // on initial page load. This causes both zoom buttons to be disabled.
    await tick();
    treeView.zoomIn();

    return treeView.destroy;
  });

  $: {
    treeView?.setDimensions({ width, height });
  }
  $: transforms = treeView?.transforms;
  $: links = treeView?.links;
  $: canZoomIn = $transforms?.scale < 1;
  $: canZoomOut = $transforms?.scale > $transforms?.minScale;
</script>

<div class="h-full w-full" bind:clientWidth={width} bind:clientHeight={height}>
  <svg bind:this={svgElement} viewBox={`0 0 ${width} ${height}`}>
    <g bind:this={boundsElement} transform={$transforms?.gTransform ?? ''}>
      {#if treeView}
        {#each $links as { link, idx, isAncestor } (idx)}
          <TreeLink {link} {isAncestor} {nodeHeight} />
        {/each}
        {#each treeView.descendants as { data, x, y }, key (key)}
          <SvgTreeNode assetStore={data} {x} {y} {nodeWidth} {nodeHeight} />
        {/each}
      {/if}
    </g>
  </svg>
  <!-- Layer the HTML nodes over the SVG paths and sync the transformations so we don't have
    to use SVG `foreignObject`, which doesn't always work great in different browsers. -->
  {#if treeView && $transforms}
    <div class="pointer-events-none absolute left-0 top-0 z-0 select-none">
      <div
        class="absolute left-0 top-0"
        style={`transform: ${$transforms.htmlTransform ?? ''};`}>
        {#each treeView.descendants as { x, y, data }, key (key)}
          <TreeNode
            assetStore={data}
            {x}
            {y}
            width={nodeWidth}
            height={nodeHeight} />
        {/each}
      </div>
    </div>
    <div>
      <div
        class="absolute bottom-16 right-5 z-20 flex h-8 items-center rounded-full bg-white shadow-md">
        <button
          class="h-full pl-2.5 pr-2 transition-opacity"
          class:opacity-40={!canZoomIn}
          on:click={treeView.zoomIn}>
          <ZoomIn width="1rem" height="1rem" class="text-gray-800" />
        </button>
        <div class="h-[85%] w-px bg-gray-200" />
        <button
          class="h-full pl-2 pr-2.5 transition-opacity"
          class:opacity-40={!canZoomOut}
          on:click={treeView.zoomOut}>
          <ZoomOut width="1rem" height="1rem" class="text-gray-800" />
        </button>
      </div>
      <div
        class="absolute bottom-5 right-5 z-20 flex h-8 items-center rounded-full bg-white shadow-md">
        <button on:click={() => verifyStore.setCompareView()}
          ><div class="mx-4 my-2 flex">
            <Compare class="me-2 h-4 w-4" />
            <Body>{$_('sidebar.verify.compare')}</Body>
          </div></button>
      </div>
    </div>
  {/if}
</div>
