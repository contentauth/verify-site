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
  import type { CompareMode } from '$src/routes/verify/stores/compareView';
  import { setCompareMode } from '$src/routes/verify/stores/compareView';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  export let isOpen = false;
  const dispatch = createEventDispatcher();
  const slider: CompareMode = 'Slider';
  const sideBySide: CompareMode = 'Side by Side';
  const compareModeArray = [sideBySide, slider];

  function closeDropDown() {
    dispatch('closeDropdown', {
      isOpen,
    });
  }
  function selectOption(mode: CompareMode) {
    setCompareMode(mode);
  }
</script>

<div class="shadow-xl absolute left-0 mr-10 mt-2 w-48 rounded-lg bg-white py-2">
  {#each compareModeArray as item (item)}
    <a
      on:click={() => selectOption(item)}
      on:click={closeDropDown}
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
