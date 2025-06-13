<!--
Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import Alert from '$assets/svg/monochrome/alert.svg?component';
  import Close from '$assets/svg/monochrome/close.svg?component';
  import { _ } from 'svelte-i18n';
  import type { ToastItem } from './store/toastState';

  export let toastItem: ToastItem;
</script>

<div
  class="pointer-events-auto inline-flex min-h-12 items-center rounded bg-red-900 py-2 ps-2.5 text-white">
  <Alert class="h-4 w-4 shrink-0" />
  <span
    class="flex h-full items-center border-r border-white/30 px-2.5 align-middle text-body"
    >{$_(toastItem.messageId)}</span>
  <button on:click={toastItem.close} class="shrink-0 p-2"
    ><Close class="h-4 w-4" /></button>
</div>
