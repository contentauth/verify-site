<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import type { HierarchyPointNode } from 'd3-hierarchy';
  import { _ } from 'svelte-i18n';
  import { get } from 'svelte/store';
  import type { ReadableAssetStore } from '../../stores/asset';

  export let assetStore: ReadableAssetStore;
  export let parent: HierarchyPointNode<ReadableAssetStore> | null;
  export let transformScale: number;

  $: title = $assetStore.title ?? $_('asset.defaultTitle');
  $: hasContentCredentials = $assetStore.manifestData
    ? $_('page.verify.hasCC.date', {
        values: { date: $assetStore.manifestData?.date },
      })
    : $_('sidebar.verify.noCC');
  $: parentData = parent?.data ? get(parent?.data) : null;
  $: parentTitle = parentData?.title;
  $: parentLabel =
    parent === null
      ? $_('sidebar.verify.compare.root')
      : $_('sidebar.verify.compare.child', {
          values: { parentTitle },
        });
  $: ariaLabel = $_('page.verify.treeNode.ariaLabel', {
    values: { title, hasContentCredentials, parentLabel },
  });
  $: clipPathOffset = transformScale >= 0.25 ? 0 : 250;
  $: removeL1 = transformScale === 0.125 ? true : false;
  $: scale = 0.5 / transformScale;
  $: L1margin = transformScale >= 0.25 ? 0.5 : transformScale / 0.25;
</script>

<div
  class="absolute flex"
  style="transform: scale({scale}); transform-origin: top left; margin-inline-start: {L1margin}rem; margin-top:{L1margin}rem;">
  <slot name="icon" />
  <div
    aria-label={ariaLabel}
    style="clip-path: inset(-10px {clipPathOffset}px -10px 0px);"
    class="-ms-11 flex items-center rounded-full py-3 pe-3 ps-11 transition-all duration-150 motion-reduce:transition-none"
    class:bg-white={!removeL1}
    class:shadow-md={!removeL1}
    class:rounded-none={removeL1}>
    {#if !removeL1}
      <div class="rounded-full bg-white text-[1.7em]">
        <slot name="string" />
      </div>
    {/if}
  </div>
</div>
