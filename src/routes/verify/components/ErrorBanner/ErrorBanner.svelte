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

  export let type: 'info' | 'warning' = 'info';
</script>

<div
  class="mb-5 p-2 text-white"
  class:bg-gray-600={type === 'info'}
  class:bg-red-900={type === 'warning'}>
  <IconContentRow>
    <svelte:fragment slot="icon">
      {#if type === 'warning'}
        <Alert />
      {:else}
        <Info />
      {/if}
    </svelte:fragment>
    <div class="grow" slot="content">
      <slot />
    </div>
  </IconContentRow>
</div>
