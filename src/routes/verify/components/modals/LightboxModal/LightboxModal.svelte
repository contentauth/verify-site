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
  import CloseIcon from '$assets/svg/monochrome/close.svg?component';
  import { focusTrap } from 'svelte-focus-trap';
  import { _ } from 'svelte-i18n';
  import { closeModal } from 'svelte-modals';
  import { fade } from 'svelte/transition';

  export let label: string;
  export let src: string;

  // provided by ModalContainer.svelte
  export let isOpen: boolean;
</script>

{#if isOpen}
  <div
    role="dialog"
    aria-modal="true"
    aria-label={label}
    class="pointer-events-none fixed inset-0 flex items-center justify-center"
    transition:fade|global={{ duration: 100 }}
    use:focusTrap>
    <div class="pointer-events-auto absolute right-0 top-0">
      <button
        class="flex cursor-pointer items-center gap-x-2 p-5 text-white transition-colors duration-100 hover:text-gray-100"
        on:click={closeModal}>
        <span><CloseIcon class="h-5 w-5"></CloseIcon></span>
        <span class="text-[1.125rem]">{$_('dialog.close')}</span>
      </button>
    </div>
    <div class="flex max-h-screen p-4 pt-14">
      <img class="object-scale-down" {src} alt={label} />
    </div>
  </div>
{/if}
