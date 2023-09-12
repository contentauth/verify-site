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
  import DownArrow from '$assets/svg/monochrome/down-arrow.svg?component';
  import { createEventDispatcher } from 'svelte';
  import type { CompareAssetStore } from '../../stores/compareAsset';
  import SmallAssetInfo from './SmallAssetInfo.svelte';

  export let compareAssetStore: CompareAssetStore;
  export let expanded = true;
  const dispatch = createEventDispatcher();
  $: hasChildren = $compareAssetStore.children.length > 0;

  function showChildren() {
    dispatch('showChildren', {
      expanded,
    });
  }
</script>

<div class="p-2" class:bg-blue-100={$compareAssetStore.isSelected}>
  <button on:click={$compareAssetStore.select} class="w-full">
    <div class="flex">
      {#if hasChildren}
        <button on:click={showChildren} class="px-2">
          <DownArrow
            class="h-2 w-3 transform duration-100 {expanded
              ? 'rotate-0'
              : '-rotate-90'}" />
        </button>
      {:else}
        <span class="ms-4" />
      {/if}
      <SmallAssetInfo
        assetData={$compareAssetStore}
        highlighted={$compareAssetStore.isActive}>
        <svelte:fragment slot="name"><slot name="name" /></svelte:fragment>
      </SmallAssetInfo>
    </div>
  </button>
</div>
