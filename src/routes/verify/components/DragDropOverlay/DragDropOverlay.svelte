<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
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
