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
  import DropFile from '$assets/svg/monochrome/drop-file.svg?component';
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { verifyStore } from '../../stores';

  let fileInput: HTMLInputElement;

  function browseFile() {
    fileInput.click();
  }

  function loadFile(evt: Event) {
    const files = (evt.target as HTMLInputElement).files;

    if (files && files.length > 0) {
      verifyStore.readC2paSource(files[0]);
    }
  }

  onMount(() => {
    fileInput.addEventListener('change', loadFile, false);

    return () => {
      fileInput.removeEventListener('change', loadFile);
    };
  });
</script>

<div class="flex h-full w-full items-center justify-center px-5">
  <input
    type="file"
    bind:this={fileInput}
    accept="image/*,video/*"
    class="hidden" />
  <div class="flex flex-col items-center space-y-5">
    <DropFile class="h-16 w-10 text-gray-500" />
    <div class="text-center text-body">
      <span>{$_('emptyState.dropFile')}</span>
      <button class="underline" on:click={browseFile}
        >{$_('emptyState.dropFile.linkText')}</button>
    </div>
  </div>
</div>
