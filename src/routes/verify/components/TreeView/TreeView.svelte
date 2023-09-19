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
  import type { HierarchyPointNode } from 'd3-hierarchy';
  import { select as d3Select } from 'd3-selection';
  import type { ZoomTransform } from 'd3-zoom';
  import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { Readable } from 'svelte/store';
  import {
    calculateTransforms,
    createLinks,
    createTree,
    defaultConfig,
    remToPx,
    zoomIn,
    zoomOut,
    type SVGSelection,
    type TreeViewConfig,
  } from '../../lib/treeView';
  import { verifyStore } from '../../stores';
  import type { ReadableAssetStore } from '../../stores/asset';
  import type { ReadableAssetMap } from '../../stores/hierarchyView';
  import SvgTreeNode from './SVGTreeNode.svelte';
  import TreeLink from './TreeLink.svelte';
  import TreeNode from './TreeNode.svelte';

  export let assetStoreMap: ReadableAssetMap;
  export let selectedAsset: Readable<AssetData>;

  const nodeWidth = remToPx(10.25);
  const nodeHeight = remToPx(10.25);
  const config: TreeViewConfig = {
    ...defaultConfig,
    nodeWidth,
    nodeHeight,
  };
  let svgElement: SVGElement;
  let boundsElement: SVGGraphicsElement;
  let svgSel: SVGSelection;
  let width = 1;
  let height = 1;
  let boundsTransform: ZoomTransform;
  let zoom = d3Zoom<SVGElement, ReadableAssetStore>().on('zoom', (evt) => {
    boundsTransform = evt.transform;
  });

  onMount(() => {
    svgSel = d3Select<SVGElement, ReadableAssetStore>(svgElement);
    svgSel
      .call(zoom)
      // Initially center on the root
      .call(zoom.transform, zoomIdentity.translate(width / 2, height * 0.3));

    return () => {
      svgSel.on('.zoom', null);
    };
  });

  $: tree = createTree({ assetStoreMap, width, height, config });
  $: transforms = calculateTransforms({
    boundsElement,
    boundsTransform,
    width,
    height,
    margin: config.margin,
  });
  $: links = createLinks(tree, $selectedAsset);
  $: descendants = tree.descendants();
  $: canCompare = descendants.length > 1;
  $: {
    // Set the proper scaleExtent whenever the width/height changes
    zoom.scaleExtent([transforms.minScale, 1]);
  }

  function getParents(node: HierarchyPointNode<ReadableAssetStore>) {
    return node.ancestors();
  }
</script>

<figure
  class="h-full w-full"
  bind:clientWidth={width}
  bind:clientHeight={height}>
  <svg bind:this={svgElement} viewBox={`0 0 ${width} ${height}`}>
    <g bind:this={boundsElement} transform={transforms.gTransform ?? ''}>
      {#each links as { link, idx, isAncestor } (idx)}
        <TreeLink {link} {isAncestor} {nodeHeight} />
      {/each}
      {#each descendants as { data, x, y }, key (key)}
        <SvgTreeNode
          assetStore={data}
          {x}
          {y}
          {nodeWidth}
          {nodeHeight}
          on:mobileTap />
      {/each}
    </g>
  </svg>
  <!-- Layer the HTML nodes over the SVG paths and sync the transformations so we don't have
    to use SVG `foreignObject`, which doesn't always work great in different browsers. -->
  <div
    role="tree"
    class="pointer-events-none absolute left-0 top-0 z-0 select-none">
    <div
      class="absolute left-0 top-0"
      style={`transform: ${transforms.htmlTransform ?? ''};`}>
      {#each descendants as { x, y, data }, key (key)}
        <TreeNode
          assetStore={data}
          {x}
          {y}
          width={nodeWidth}
          height={nodeHeight}
          parents={getParents(descendants[key])} />
      {/each}
    </div>
  </div>

  <div
    class="absolute bottom-5 right-5 z-20 flex flex-col items-end justify-end space-y-5">
    <div class="flex h-8 items-center rounded-full bg-white shadow-md">
      <button
        class="h-full pe-2 ps-2.5 transition-opacity"
        class:opacity-40={!transforms.canZoomIn}
        on:click={() => transforms.canZoomIn && zoomIn({ svgSel, zoom })}
        aria-roledescription={$_('page.verify.zoomIn')}>
        <ZoomIn width="1rem" height="1rem" class="text-gray-800" />
      </button>
      <div class="h-[85%] w-px bg-gray-200" />
      <button
        class="h-full pe-2.5 ps-2 transition-opacity"
        class:opacity-40={!transforms.canZoomOut}
        aria-roledescription={$_('page.verify.zoomOut')}
        on:click={() =>
          transforms.canZoomOut &&
          zoomOut({
            svgSel,
            zoom,
            boundsElement,
            width,
            height,
            minZoomScale: transforms.minZoomScale,
          })}>
        <ZoomOut width="1rem" height="1rem" class="text-gray-800" />
      </button>
    </div>
    <div class="flex h-8 items-center rounded-full bg-white shadow-md">
      <button
        on:click={() => canCompare && verifyStore.setCompareView()}
        class:opacity-40={!canCompare}
        ><div class="mx-3 my-2 flex items-center">
          <Compare class="me-2 h-4 w-4" />
          <Body>{$_('sidebar.verify.compare')}</Body>
        </div></button>
    </div>
  </div>
</figure>
