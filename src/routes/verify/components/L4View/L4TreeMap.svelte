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
  import { treemap } from 'd3-hierarchy';
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

  export let hierarchy: any;

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
    const root = hierarchy.sum((d: any) => {
      return d.dataSize?.total ?? d.size ?? 1;
    });

    treemap().size([width, height]).padding(2)(root);

    console.log('root', root);

    svgSel
      .selectAll('rect')
      .data(root.leaves())
      .enter()
      .append('rect')
      .attr('x', function (d: any) {
        return d.x0;
      })
      .attr('y', function (d: any) {
        return d.y0;
      })
      .attr('width', function (d: any) {
        return d.x1 - d.x0;
      })
      .attr('height', function (d: any) {
        return d.y1 - d.y0;
      })
      .style('stroke', 'black')
      .style('fill', 'slateblue');

    svgSel
      .selectAll('text')
      .data(root.leaves())
      .enter()
      .append('text')
      .attr('x', function (d: any) {
        return d.x0 + 5;
      })
      .attr('y', function (d: any) {
        return d.y0 + 20;
      })
      .text(function (d: any) {
        console.log('d', d);

        return d.data.uri;
      })
      .attr('font-size', '15px')
      .attr('fill', 'white');
  });
</script>

<figure
  class="h-full w-full overflow-clip"
  bind:clientWidth={width}
  bind:clientHeight={height}>
  <svg bind:this={svgElement} viewBox={`0 0 ${width} ${height}`} />
</figure>
