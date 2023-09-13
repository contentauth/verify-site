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
  import Label from '$src/components/typography/Label.svelte';
  import {
    compareViewMode,
    type CompareMode,
  } from '$src/routes/verify/stores/compareView';
  import { _ } from 'svelte-i18n';
  import DropDownOptions from './DropDownOptions.svelte';
  import DropdownButton from './DropdownButton.svelte';

  let isOpen = false;

  function handleOption(mode: CompareMode) {
    compareViewMode.set(mode);
    isOpen = !isOpen;
  }
</script>

<div class="flex items-center pb-5">
  <div class="pe-2 ps-5 capitalize">
    <Label>{$_('sidebar.verify.compare.dropdown')}</Label>
  </div>
  <div class="relative">
    <DropdownButton {compareViewMode} on:click={() => (isOpen = !isOpen)} />
    {#if isOpen}
      <DropDownOptions on:click={(e) => handleOption(e.detail.mode)}
      ></DropDownOptions>
    {/if}
  </div>
</div>
