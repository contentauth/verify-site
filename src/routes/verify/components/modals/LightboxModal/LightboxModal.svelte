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
  import { focusTrap } from 'svelte-focus-trap';
  import { _ } from 'svelte-i18n';
  import { closeModal } from 'svelte-modals';
  import { fade } from 'svelte/transition';
  import Button from '../../Button/Button.svelte';

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
    <div class="pointer-events-auto absolute right-5 top-5">
      <Button variant="secondary" size="m" on:click={closeModal}
        >{$_('dialog.close')}</Button>
    </div>
    <div class="flex max-h-screen p-4">
      <img class="object-scale-down" {src} alt={label} />
    </div>
  </div>
{/if}
