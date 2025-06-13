<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import DownArrow from '$assets/svg/monochrome/down-arrow.svg?component';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { CompareAssetStore } from '../../stores/compareAsset';
  import SmallAssetInfo from './SmallAssetInfo.svelte';

  export let compareAssetStore: CompareAssetStore;
  export let expanded = true;
  // This offsets the highlight area during scroll so no scrollbar-related gaps appear
  export let highlightOffset = 0;

  const dispatch = createEventDispatcher();

  $: hasChildren = $compareAssetStore.children.length > 0;
  $: disabled = !$compareAssetStore.thumbnail;
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

<div>
  <div
    class="absolute left-0 z-0 h-16 p-2 transition-colors duration-200"
    style:right={`${highlightOffset * -1}px`}
    class:bg-blue-100={$compareAssetStore.isSelected} />
  <div class="relative flex p-2">
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
      {disabled}
      on:click={() => $compareAssetStore.select()}
      class="w-full"
      class:opacity-40={disabled}
      class:cursor-not-allowed={disabled}
      aria-roledescription={selectAriaLabel}>
      <SmallAssetInfo
        assetData={$compareAssetStore}
        highlighted={$compareAssetStore.isActive}>
        <svelte:fragment slot="name"><slot name="name" /></svelte:fragment>
      </SmallAssetInfo>
    </button>
  </div>
</div>
