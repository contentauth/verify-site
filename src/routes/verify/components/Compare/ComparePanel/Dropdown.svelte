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
  import Body from '$src/components/typography/Body.svelte';
  import Label from '$src/components/typography/Label.svelte';
  import type { CompareMode } from '$src/routes/verify/stores/compareView';
  import {
    compareMode,
    setCompareMode,
  } from '$src/routes/verify/stores/compareView';
  import { _ } from 'svelte-i18n';

  let isOpen = false;
  const slider: CompareMode = 'Slider';
  const sideBySide: CompareMode = 'Side by Side';
  const compareModeArray = [sideBySide, slider];

  function selectOption(mode: CompareMode) {
    setCompareMode(mode);
    isOpen = false;
  }
</script>

<div class="flex items-center pb-5">
  <div class="pe-2 ps-5 capitalize">
    <Label>{$_('sidebar.verify.compare.dropdown')}</Label>
  </div>
  <div class="relative">
    <button
      class="h-7 w-44 border border-gray-500 pe-2 ps-2"
      on:click={() => (isOpen = !isOpen)}>
      <div class="flex justify-between">
        <Body>
          {#if $compareMode === 'Slider'}
            {$_('sidebar.verify.compare.slider')}
          {:else}
            {$_('sidebar.verify.compare.sideBySide')}
          {/if}</Body>
        <DownArrow class="h-3 w-3 self-center"></DownArrow>
      </div>
    </button>
    {#if isOpen}
      <div
        class="shadow-xl absolute left-0 mr-10 mt-2 w-48 rounded-lg bg-white py-2">
        {#each compareModeArray as item (item)}
          <a
            on:click={() => selectOption(item)}
            href="#top"
            class="hover:bg-indigo-500 block px-4 py-2 text-gray-800">
            {#if item === 'Side by Side'}
              {$_('sidebar.verify.compare.sideBySide')}
            {:else}
              {$_('sidebar.verify.compare.slider')}
            {/if}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>
