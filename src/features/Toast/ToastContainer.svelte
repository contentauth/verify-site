<!--
Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import { prefersReducedMotion } from '$src/lib/matchMedia';
  import { flip } from 'svelte/animate';
  import { fade, fly } from 'svelte/transition';
  import Toast from './Toast.svelte';
  import { toast } from './store/toastState';
</script>

<ul
  class="pointer-events-none absolute inset-0 flex flex-col items-center justify-end overflow-hidden px-4 pb-10"
  role="alert">
  {#each $toast as toastItem, idx (toastItem.id)}
    <li
      data-testid={`toast-${idx}`}
      class="mt-2"
      in:fly={{ y: prefersReducedMotion ? 128 : 0 }}
      out:fade={{ duration: 100 }}
      animate:flip={{ duration: prefersReducedMotion ? 100 : 0 }}>
      <Toast {toastItem} />
    </li>
  {/each}
</ul>
