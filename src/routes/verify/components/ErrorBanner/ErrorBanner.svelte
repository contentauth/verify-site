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
  import Alert from '$assets/svg/monochrome/alert.svg?component';
  import Info from '$assets/svg/monochrome/info.svg?component';
  import IconContentRow from '../IconContentRow/IconContentRow.svelte';

  export let type: 'info' | 'warning' | 'error' = 'info';
</script>

<div
  class="mx-5 mb-5 rounded p-2.5 text-white"
  class:bg-gray-600={type === 'info'}
  class:bg-orange-700={type === 'warning'}
  class:bg-red-1000={type === 'error'}>
  <IconContentRow>
    <svelte:fragment slot="icon">
      {#if type === 'info'}
        <Info class="h-4 w-4" />
      {:else}
        <Alert class="h-4 w-4" />
      {/if}
    </svelte:fragment>
    <div class="grow" slot="content">
      <slot />
    </div>
  </IconContentRow>
</div>
