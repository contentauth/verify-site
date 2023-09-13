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

  import { _ } from 'svelte-i18n';

  export let compareViewMode;
</script>

<button class="h-7 w-44 border border-gray-500 pe-2 ps-2" on:click>
  <div class="flex justify-between">
    <Body>
      {#if $compareViewMode === 'slider'}
        {$_('sidebar.verify.compare.slider')}
      {:else}
        {$_('sidebar.verify.compare.sideBySide')}
      {/if}</Body>
    <DownArrow class="h-3 w-3 self-center"></DownArrow>
  </div>
</button>
