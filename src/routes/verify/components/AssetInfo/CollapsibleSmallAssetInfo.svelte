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
  import { _ } from 'svelte-i18n';
  import type { CompareAssetStore } from '../../stores/compareAsset';
  import SmallAssetInfo from './SmallAssetInfo.svelte';

  export let compareAssetStore: CompareAssetStore;
  export let expanded = true;
  const dispatch = createEventDispatcher();
  $: hasChildren = $compareAssetStore.children.length > 0;
  $: expandAriaLabel = expanded
    ? $_('sidebar.verify.compare.ariaLabel.hide', {
        values: { title: $compareAssetStore.title },
      })
    : $_('sidebar.verify.compare.ariaLabel.expand', {
        values: { title: $compareAssetStore.title },
      });
  $: selectAriaLabel = $compareAssetStore.isSelected
    ? $_('sidebar.verify.compare.assetSelected')
    : $_('sidebar.verify.compare.clickAssetSelected');

  function showChildren() {
    dispatch('showChildren', {
      expanded,
    });
  }
</script>

<div class="p-2" class:bg-blue-100={$compareAssetStore.isSelected}>
  <div class="flex">
    {#if hasChildren}
      <button on:click={showChildren} class="px-2" aria-label={expandAriaLabel}>
        <DownArrow
          class="h-2 w-3 transform duration-100 {expanded
            ? 'rotate-0'
            : '-rotate-90'}" />
      </button>
    {:else}
      <span class="ms-4" />
    {/if}
    <button
      on:click={$compareAssetStore.select}
      class="w-full"
      aria-roledescription={selectAriaLabel}>
      <SmallAssetInfo
        assetData={$compareAssetStore}
        highlighted={$compareAssetStore.isActive}>
        <svelte:fragment slot="name"><slot name="name" /></svelte:fragment>
      </SmallAssetInfo>
    </button>
  </div>
</div>
