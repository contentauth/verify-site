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
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';

  const dispatch = createEventDispatcher();
  const slider: CompareMode = 'slider';
  const sideBySide: CompareMode = 'sideBySide';
  const compareModeArray = [sideBySide, slider];

  function selectOption(mode: CompareMode) {
    dispatch('click', {
      mode,
    });
  }
</script>

<div class="shadow-xl absolute left-0 w-full rounded-lg bg-white">
  {#each compareModeArray as item (item)}
    <button
      on:click={() => selectOption(item)}
      class="hover:bg-indigo-500 block w-full p-2 px-4 text-start text-gray-800">
      {#if item === 'sideBySide'}
        {$_('sidebar.verify.compare.sideBySide')}
      {:else}
        {$_('sidebar.verify.compare.slider')}
      {/if}
    </button>
  {/each}
</div>
