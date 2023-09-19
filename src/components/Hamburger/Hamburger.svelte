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
