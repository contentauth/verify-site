<script lang="ts">
  import { isJumbfUri, normalizeUri } from '$src/lib/jumbf';
  import type TreeNode from 'svelte-tree-view';
  import { verifyStore } from '../../../stores';

  // export let node: TreeNode;
  export let value: any;
  export let defaultFormatter: any;

  const { selectL4Ref, selectedL4Node } = verifyStore;

  $: isUrl = isHttpUrl(value);
  $: isJumbf = isJumbfUri(value);

  const REGEX_HTTP_PROTOCOL = /^https?:\/\//i;

  // From https://github.com/Kikobeats/url-http
  function isHttpUrl(url: string) {
    try {
      const { href } = new URL(url);

      return REGEX_HTTP_PROTOCOL.test(href) && href;
    } catch (err) {
      return false;
    }
  }
</script>

{#if isJumbf}
  <button
    on:click={() =>
      selectL4Ref([normalizeUri(value, $selectedL4Node.assertion.manifestUri)])}
    class="text-blue-900 underline">
    {value}
  </button>
{:else if isUrl}
  <div>
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      class="text-blue-900 underline">{value}</a>
  </div>
{:else}
  <div>{defaultFormatter(value)}</div>
{/if}
