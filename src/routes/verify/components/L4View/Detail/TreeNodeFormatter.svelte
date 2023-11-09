<script lang="ts">
  import type TreeNode from 'svelte-tree-view';

  // export let node: TreeNode;
  export let value: any;
  export let defaultFormatter: any;

  $: isUrl = isHttpUrl(value);

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

{#if isUrl}
  <div>
    <a href={value} target="_blank" rel="noopener noreferrer" class="underline"
      >{value}</a>
  </div>
{:else}
  <div>{defaultFormatter(value)}</div>
{/if}
