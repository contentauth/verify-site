<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Link from '../typography/Link.svelte';
  import SmallDescription from '../typography/SmallDescription.svelte';
  import Truncate from '../typography/Truncate.svelte';

  export let link: string | null;
  export let username: string;
  export let appName: string;
</script>

<div class="flex flex-col">
  <Truncate>
    {#if link}
      <Link>
        <a class="break-all" href={link} title={username}>{username}</a>
      </Link>
    {:else}
      <span class="break-all">{username}</span>
    {/if}
  </Truncate>
  <div class="pt-0.5">
    <SmallDescription>{appName}</SmallDescription>
  </div>
</div>
