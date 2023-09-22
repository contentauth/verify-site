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
  import { Modals, closeModal } from 'svelte-modals';
  import { fade } from 'svelte/transition';

  function handleKeyDown({ key }: KeyboardEvent) {
    if (key === 'Escape') {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<Modals>
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions  -->
  <div
    slot="backdrop"
    class="fixed inset-0 bg-gray-900/80"
    transition:fade={{ duration: 100 }}
    on:click={closeModal} />
</Modals>
