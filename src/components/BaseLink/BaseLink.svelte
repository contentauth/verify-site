<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import { base } from '$app/paths';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface $$Props extends HTMLAnchorAttributes {
    href: string;
  }

  export let href = '';
</script>

<a on:click href={`${base}${href}`} {...$$restProps}><slot /></a>
