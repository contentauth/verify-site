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
  import type { CompareAssetStore } from '../../../stores/compareAsset';
  import CollapsibleSmallAssetInfo from '../../AssetInfo/CollapsibleSmallAssetInfo.svelte';

  export let expanded = true;
  export let compareAssetStoreMap: CompareAssetStoreMap;
  export let compareAssetStore: CompareAssetStore = compareAssetStoreMap[0];
</script>

<CollapsibleSmallAssetInfo
  {compareAssetStore}
  {expanded}
  on:showChildren={() => (expanded = !expanded)}
  ><svelte:fragment slot="name">
    {$compareAssetStore.title}</svelte:fragment
  ></CollapsibleSmallAssetInfo>

{#if expanded}
  {#each $compareAssetStore.children as child}
    <div class="ps-8">
      <svelte:self
        compareAssetStore={compareAssetStoreMap[child]}
        {compareAssetStoreMap} />
    </div>
  {/each}
{/if}
