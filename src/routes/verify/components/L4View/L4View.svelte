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
  import { select as d3Select } from 'd3-selection';
  import type { ZoomTransform } from 'd3-zoom';
  import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom';
  import { onMount } from 'svelte';
  import {
    calculateTransforms,
    defaultConfig,
    type SVGSelection,
    type TreeViewConfig,
  } from '../../lib/treeView';
  import type { ReadableAssetStore } from '../../stores/asset';
  import SVGTreeNode from './SVGTreeNode.svelte';
  import TreeNode from './TreeNode.svelte';

  export let tree: any;

  const clickDistance = 10;
  const config: TreeViewConfig = {
    ...defaultConfig,
  };
  let svgElement: SVGElement;
  let boundsElement: SVGGraphicsElement;
  let svgSel: SVGSelection;
  let width = 1;
  let height = 1;
  let boundsTransform: ZoomTransform;
  let zoom = d3Zoom<SVGElement, ReadableAssetStore>()
    .on('zoom', (evt) => {
      boundsTransform = evt.transform;
    })
    .clickDistance(clickDistance);

  onMount(() => {
    svgSel = d3Select<SVGElement, any>(svgElement);
    svgSel
      .call(zoom)
      // Initially center on the root
      .call(zoom.transform, zoomIdentity.translate(width / 2, height * 0.3));

    return () => {
      svgSel.on('.zoom', null);
    };
  });

  $: transforms = calculateTransforms({
    boundsElement,
    boundsTransform,
    width,
    height,
    margin: config.margin,
  });
  $: descendants = tree.descendants();
  $: {
    // Set the proper scaleExtent whenever the width/height changes
    zoom.scaleExtent([transforms.minScale, 1]);
  }
</script>

<figure
  class="h-full w-full overflow-clip"
  bind:clientWidth={width}
  bind:clientHeight={height}>
  <svg bind:this={svgElement} viewBox={`0 0 ${width} ${height}`}>
    <g bind:this={boundsElement} transform={transforms.gTransform ?? ''}>
      {#each descendants as { x: y, y: x, xSize, ySize }, key (key)}
        <SVGTreeNode {x} {y} width={ySize} height={xSize} />
      {/each}
    </g>
  </svg>
  <div
    class="pointer-events-none absolute left-0 top-0"
    style={`transform: ${transforms.htmlTransform ?? ''};`}>
    {#each descendants as { data, x: y, y: x, xSize, ySize }, key (key)}
      <TreeNode {data} {x} {y} width={ySize} height={xSize} />
    {/each}
  </div>
</figure>
