<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
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
