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
  import { _ } from 'svelte-i18n';
  import DropDownOptions from './DropDownOptions.svelte';
  import DropdownButton from './DropdownButton.svelte';

  export let isOpen = false;
</script>

<div class="flex items-center pb-5">
  <div class="pe-2 ps-5 capitalize">
    <Label>{$_('sidebar.verify.compare.dropdown')}</Label>
  </div>
  <div class="relative">
    <DropdownButton {isOpen} on:toggleDropdown={() => (isOpen = !isOpen)} />
    {#if isOpen}
      <DropDownOptions {isOpen} on:closeDropdown={() => (isOpen = !isOpen)}
      ></DropDownOptions>
    {/if}
  </div>
</div>
