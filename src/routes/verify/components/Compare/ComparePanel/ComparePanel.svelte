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
  import BackArrow from '$assets/svg/monochrome/back-arrow.svg?component';
  import Header from '$src/components/typography/Header.svelte';
  import Label from '$src/components/typography/Label.svelte';
  import {
    compareViewMode,
    type CompareAssetStoreMap,
    type CompareMode,
  } from '$src/routes/verify/stores/compareView';
  import { _ } from 'svelte-i18n';
  import { verifyStore } from '../../../stores';
  import CompareAsset from './CompareAsset.svelte';

  export let assetStoreMap: CompareAssetStoreMap;

  const compareModeArray: CompareMode[] = ['sideBySide', 'slider'];
  let highlightOffset = 0;

  function handleViewChange(evt: Event) {
    const value = (evt.target as HTMLSelectElement).value as CompareMode;
    compareViewMode.set(value);
  }

  function handleScroll(evt: Event) {
    highlightOffset = (evt.target as HTMLDivElement).scrollLeft;
  }
</script>

<div class="min-height-0 relative flex h-full flex-col">
  <div>
    <button
      class="me-2"
      on:click={() => verifyStore.setHierarchyView()}
      aria-roledescription={$_('sidebar.verify.compare.back')}>
      <div class="flex items-center px-5 py-5 pb-2">
        <BackArrow class="relative -top-px me-2 h-4 w-4 shrink" />
        <Header>{$_('sidebar.verify.compare')}</Header>
      </div>
    </button>
    <div class="flex w-full items-center px-5 pb-4 pt-2">
      <div class="shrink-0 pe-2">
        <Label>{$_('sidebar.verify.compare.dropdown')}</Label>
      </div>
      <select
        on:change={handleViewChange}
        class="back form-select w-full rounded-sm border border-gray-400 bg-[center_right_0.25rem] px-2 text-[0.8125rem] leading-3">
        {#each compareModeArray as item (item)}
          <option value={item} selected={item === $compareViewMode}
            >{$_(`sidebar.verify.compare.${item}`)}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="relative min-h-0 flex-1 overflow-auto" on:scroll={handleScroll}>
    <CompareAsset compareAssetStoreMap={assetStoreMap} {highlightOffset} />
  </div>
</div>
