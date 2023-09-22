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
  import { onMount } from 'svelte';
  import { verifyStore } from '../../stores';

  let fileInput: HTMLInputElement;

  export function launch() {
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

<!--
	We don't set an accept attribute since it would filter out DNG files
	since the system may not know about their MIME type (at least in macOS)
-->
<input type="file" bind:this={fileInput} class="hidden" />
