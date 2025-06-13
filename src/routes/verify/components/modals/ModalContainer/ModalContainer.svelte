<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
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
    class="fixed inset-0 bg-[#000000]/80"
    transition:fade={{ duration: 100 }}
    on:click={closeModal} />
</Modals>
