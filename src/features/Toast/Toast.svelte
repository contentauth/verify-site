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
  import Alert from '$assets/svg/monochrome/alert.svg?component';
  import Close from '$assets/svg/monochrome/close.svg?component';
  import { _ } from 'svelte-i18n';
  import type { ToastItem } from './store/toastState';

  export let toastItem: ToastItem;
</script>

<div
  class="min-h-12 pointer-events-auto inline-flex items-center rounded bg-red-900 py-2 ps-2.5 text-white">
  <Alert class="h-4 w-4 shrink-0" />
  <span
    class="flex h-full items-center border-r border-white/30 px-2.5 align-middle text-body"
    >{$_(toastItem.messageId)}</span>
  <button on:click={toastItem.close} class="shrink-0 p-2"
    ><Close class="h-4 w-4" /></button>
</div>
