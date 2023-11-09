<script lang="ts">
  import Link from '$src/components/typography/Link.svelte';
  import { SUPPORTED_FORMATS } from '$src/lib/formats';
  import prettyBytes from 'pretty-bytes';
  import { onMount } from 'svelte';

  export let blob: Blob;

  let blobUrl: string;
  let viewable = false;

  $: formattedSize = prettyBytes(blob.size);

  onMount(() => {
    (async () => {
      const format = SUPPORTED_FORMATS[blob.type];

      if (format) {
        viewable = await format.browserViewable();
      }

      if (blob) {
        blobUrl = URL.createObjectURL(blob);
      }
    })();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  });
</script>

<div>
  {#if blobUrl && viewable}
    <img src={blobUrl} class="h-72 w-full object-contain" alt="" />
  {:else if !viewable}
    <div>
      This file cannot be viewed in your browser. Please download it instead.
    </div>
  {/if}
  <div class="mt-4 flex justify-center space-x-3 text-body text-gray-600">
    <div>{blob.type}</div>
    <div>&bull;</div>
    <div>{formattedSize}</div>
    {#if blobUrl}
      <div>&bull;</div>
      <div>
        <a href={blobUrl} download
          ><Link><span class="text-body">Download file</span></Link></a>
      </div>
    {/if}
  </div>
</div>
