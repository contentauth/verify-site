<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import { focusTrap } from 'svelte-focus-trap';
  import { fade } from 'svelte/transition';

  export let label: string;
</script>

<div
  role="dialog"
  aria-modal="true"
  aria-live="polite"
  aria-label={label}
  class="pointer-events-none fixed inset-0 flex items-center justify-center"
  transition:fade|global={{ duration: 100 }}
  use:focusTrap>
  <div class="pointer-events-auto">
    <slot />
  </div>
</div>
