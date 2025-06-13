<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import Spinner from '$src/components/Spinner/Spinner.svelte';
  import { prefersReducedMotion } from '$src/lib/matchMedia';
  import { _ } from 'svelte-i18n';
  import { fade } from 'svelte/transition';

  export let visible = false;
</script>

{#if visible}
  <div
    data-testid="loading-overlay"
    class="text-black fixed inset-0 z-50 flex select-none bg-gray-40/90 p-10"
    transition:fade={{ duration: prefersReducedMotion ? 0 : 100 }}>
    <div
      class="align-center flex w-full flex-col items-center justify-center space-y-5">
      <Spinner
        size="l"
        --mod-progress-circle-track-border-color="#e5e5e5"
        --mod-progress-circle-thickness="0.375rem" />
      <div class="font-weight-400 font-base text-[2rem] leading-10">
        {$_('overlay.loading.title')}
      </div>
    </div>
  </div>
{/if}
