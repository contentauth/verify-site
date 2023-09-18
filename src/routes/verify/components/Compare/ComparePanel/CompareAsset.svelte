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
  import type { CompareAssetStoreMap } from '$src/routes/verify/stores/compareView';
  import { _ } from 'svelte-i18n';
  import type { CompareAssetStore } from '../../../stores/compareAsset';
  import CollapsibleSmallAssetInfo from '../../AssetInfo/CollapsibleSmallAssetInfo.svelte';

  export let expanded = true;
  export let compareAssetStoreMap: CompareAssetStoreMap;
  export let compareAssetStore: CompareAssetStore = compareAssetStoreMap[0];
  export let parent: CompareAssetStore = compareAssetStoreMap[0];
  let ariaHidden = false;

  function showChildren() {
    expanded = !expanded;
    ariaHidden = !ariaHidden;
  }

  $: ariaLabel =
    compareAssetStore === compareAssetStoreMap[0]
      ? $_('sidebar.verify.compare.root')
      : $_('sidebar.verify.compare.child') + $parent.title;
</script>

<div aria-label={ariaLabel}>
  <CollapsibleSmallAssetInfo
    {compareAssetStore}
    {expanded}
    on:showChildren={showChildren}
    ><span slot="name">
      {$compareAssetStore.title ?? $_('asset.defaultTitle')}</span
    ></CollapsibleSmallAssetInfo>
</div>
{#if expanded}
  <div aria-hidden={ariaHidden} aria-live="off">
    {#each $compareAssetStore.children as child}
      <div class="ps-8">
        <svelte:self
          parent={compareAssetStore}
          compareAssetStore={compareAssetStoreMap[child]}
          {compareAssetStoreMap} />
      </div>
    {/each}
  </div>
{/if}
