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
  import close from '$assets/svg/color/logos/close.svg';
  import Description from '$src/components/typography/Description.svelte';
  import { _ } from 'svelte-i18n';

  export let showTooltip: boolean;
</script>

<div class="h-30 mt-5 flex w-full justify-between rounded bg-gray-100">
  <div class="py-5 ps-5">
    <Description>
      {$_('sidebar.verify.search.tooltip')}</Description>
  </div>
  <button
    class="box-content h-4 w-4 shrink-0 self-start py-6 pe-5 ps-3"
    on:click={() => (showTooltip = !showTooltip)}
    ><img
      src={close}
      alt={$_('sidebar.verify.search.tooltip.close')} /></button>
</div>
