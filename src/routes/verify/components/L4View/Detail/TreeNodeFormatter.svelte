<script lang="ts">
  import { isJumbfUri, normalizeUri } from '$src/lib/jumbf';
  import type TreeNode from 'svelte-tree-view';
  import { verifyStore } from '../../../stores';

  export let node: TreeNode;
  export let value: any;
  export let defaultFormatter: any;

  const { selectL4Ref, selectedL4Node } = verifyStore;

  $: isUrl = isHttpUrl(value);
  $: isJumbf = isJumbfUri(value);
  $: isHash =
    (node.key === 'hash' || node.key === 'pad') &&
    (value instanceof Uint8Array || value instanceof Array);

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

  function hashToBase64(hash: Uint8Array) {
    return btoa(
      hash.reduce((data, byte) => data + String.fromCharCode(byte), ''),
    );
  }
</script>

{#if isJumbf}
  <button
    on:click={() =>
      selectL4Ref([
        normalizeUri(
          value,
          $selectedL4Node.assertion?.manifestUri ?? $selectedL4Node.ref?.[0],
        ),
      ])}
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
{:else if isHash}
  <div class="rounded bg-gray-100 px-1 py-0.5">
    <span class="text-[0.7rem] text-gray-400">base64:</span><span
      >{hashToBase64(value)}</span>
  </div>
{:else}
  <div>{defaultFormatter(value)}</div>
{/if}
