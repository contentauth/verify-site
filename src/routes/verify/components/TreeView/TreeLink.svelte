<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import type { HierarchyPointLink } from 'd3-hierarchy';
  import type { Path } from 'd3-path';
  import { path as d3Path } from 'd3-path';
  import type { ReadableAssetStore } from '../../stores/asset';

  export let link: HierarchyPointLink<ReadableAssetStore>;
  export let isAncestor = false;
  export let nodeHeight: number;
  export let dashSize = 3;
  export let transformScale: number;

  // This creates the connectors using the same line shape that is used in the design.
  // Since there were none in the D3 library that looked like the ones in the mock, we
  // had to make our own, so we create a custom path using this function.
  function curve(
    context: Path,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
  ) {
    const startY = y0 + nodeHeight / 2;
    const endY = y1 - nodeHeight / 2;
    context.moveTo(x0, startY);

    if (x0 === x1) {
      context.lineTo(x1, endY);

      return context;
    }

    const midOffset = (endY - startY) / 2;
    const midY = startY + midOffset;
    const left = x0 > x1;

    if (left) {
      const midX = x0 - midOffset;
      context.bezierCurveTo(x0, midY, x0 - 20, midY, midX, midY);
      context.lineTo(x1 + midOffset, midY);
      context.bezierCurveTo(x1 + midOffset, midY, x1, midY, x1, endY);
    } else {
      const midX = x0 + midOffset;
      context.bezierCurveTo(x0, midY, x0 + 20, midY, midX, midY);
      context.lineTo(x1 - midOffset, midY);
      context.bezierCurveTo(x1 - midOffset, midY, x1, midY, x1, endY);
    }

    return context;
  }

  $: source = link.source;
  $: target = link.target;
  $: sourceAsset = source.data;
  $: isDashed = $sourceAsset.validationResult?.hasOtgp;
  $: path = curve(d3Path(), source.x, source.y, target.x, target.y);
  $: pathData = path.toString();
  //in the case where the ratio between the tree's size and the window is smaller than the minimum scale , we want a constant strokeWidth of 0.7rem , that value will gradually decrease from 0.7 to ~0.3rem for the other scales
  $: strokeWidth =
    transformScale < 0.125 ? 0.7 : 0.3 + 0.5 / transformScale / 10;
  $: style = `stroke-width: ${strokeWidth}rem`;
</script>

<path
  d={pathData}
  class="fill-none stroke-current text-gray-400 transition-all motion-reduce:transition-none"
  {style}
  class:text-gray-600={isAncestor}
  stroke-dasharray={isDashed ? dashSize.toString() : `0`} />
