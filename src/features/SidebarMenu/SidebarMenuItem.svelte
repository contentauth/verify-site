<!--
Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import BaseLink from '$src/components/BaseLink/BaseLink.svelte';
  import Header from '$src/components/typography/Header.svelte';
  import type { HTMLAttributeAnchorTarget } from 'svelte/elements';
  import { sidebarMenuState } from './store/sidebarMenuState';

  export let href = '';
  export let target: HTMLAttributeAnchorTarget = '_self';

  function handleClick() {
    sidebarMenuState.setClosed();
  }
</script>

<BaseLink
  {href}
  {target}
  on:click={handleClick}
  class="text-lg/6 block px-7 py-2.5 font-extrabold hover:bg-blue-100 focus:bg-blue-100">
  <Header><slot /></Header>
</BaseLink>
