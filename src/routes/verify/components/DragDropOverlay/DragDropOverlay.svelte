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
  import { _ } from 'svelte-i18n';
  import { fade } from 'svelte/transition';

  export let visible = false;
</script>

{#if visible}
  <div
    class="fixed inset-0 z-50 flex bg-blue-800/90 p-10 text-white"
    transition:fade={{ duration: 100 }}>
    <div
      class="align-center flex w-full flex-col items-center justify-center space-y-5 text-center font-base">
      <div class="text-[3.75rem] font-bold leading-[3.75rem]">
        {$_('overlay.dragDrop.title')}
      </div>
      <div class="font-weight-400 text-[2rem] leading-10">
        {$_('overlay.dragDrop.subtitle')}
      </div>
    </div>
  </div>
{/if}
