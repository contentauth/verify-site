<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import { ROOT_ID } from '$lib/asset';
  import type { CompareAssetStoreMap } from '$src/routes/verify/stores/compareView';
  import { _ } from 'svelte-i18n';
  import type { CompareAssetStore } from '../../../stores/compareAsset';
  import CollapsibleSmallAssetInfo from '../../AssetInfo/CollapsibleSmallAssetInfo.svelte';

  export let expanded = true;
  export let compareAssetStoreMap: CompareAssetStoreMap;
  export let compareAssetStore: CompareAssetStore = compareAssetStoreMap[0];
  export let parent: CompareAssetStore = compareAssetStoreMap[0];
  export let highlightOffset = 0;

  function showChildren() {
    expanded = !expanded;
  }

  $: title = $compareAssetStore.title ?? $_('asset.defaultTitle');
  $: ariaLabel =
    $compareAssetStore.id === ROOT_ID
      ? $_('sidebar.verify.compare.root')
      : $_('sidebar.verify.compare.child', {
          values: { parentTitle: $parent.title },
        });
</script>

<div aria-label={ariaLabel}>
  <CollapsibleSmallAssetInfo
    {compareAssetStore}
    {expanded}
    {highlightOffset}
    on:showChildren={showChildren}
    ><span slot="name" {title}>{title}</span></CollapsibleSmallAssetInfo>
</div>
{#if expanded}
  <div aria-hidden={!expanded}>
    {#each $compareAssetStore.children as child}
      <div class="ps-8">
        <svelte:self
          parent={compareAssetStore}
          compareAssetStore={compareAssetStoreMap[child]}
          {highlightOffset}
          {compareAssetStoreMap} />
      </div>
    {/each}
  </div>
{/if}
