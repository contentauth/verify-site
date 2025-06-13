<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import { fly } from 'svelte/transition';

  export let showPanel: boolean;
  let element: HTMLDivElement;

  export function getElement() {
    return element;
  }
</script>

<div
  bind:this={element}
  class="relative z-20 h-[calc(100vh-theme(spacing.header))] overflow-auto overflow-x-hidden border-gray-100 bg-white transition-transform motion-reduce:transition-none sm:h-[calc(100vh-theme(spacing.header))] sm:transform-none sm:border-s-2 lg:h-screen"
  class:-translate-y-h-screen={showPanel}
  transition:fly={{ duration: 300, opacity: 0, x: 200 }}>
  <slot />
</div>
