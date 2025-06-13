<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import { _ } from 'svelte-i18n';

  export let open = false;
</script>

<button
  on:click
  aria-label={$_('aria.label.menuToggle')}
  class="flex flex-col gap-1 p-4"
  class:open>
  <span class="burger-line top" />
  <span class="burger-line middle" />
  <span class="burger-line bottom" />
</button>

<style lang="postcss">
  .burger-line {
    @apply h-0.5 w-5 bg-gray-900;
  }

  .open {
    .top {
      @apply translate-y-1.5 -rotate-45;
    }

    .middle {
      @apply invisible;
    }

    .bottom {
      @apply -translate-y-1.5 rotate-45;
    }
  }
</style>
