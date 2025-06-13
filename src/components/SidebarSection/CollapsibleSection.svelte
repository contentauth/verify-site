<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import DownArrow from '$assets/svg/monochrome/down-arrow.svg?component';
  import { _ } from 'svelte-i18n';
  import Header from '../typography/Header.svelte';
  import SmallDescription from '../typography/SmallDescription.svelte';
  import SidebarSectionBase from './SidebarSectionBase.svelte';

  export let expanded = true;
  $: ariaLabel = expanded
    ? $_('sidebar.verify.hideCollapsible')
    : $_('sidebar.verify.showCollapsible');
</script>

<div class="px-5">
  <SidebarSectionBase {expanded}>
    <svelte:fragment slot="headerSection">
      <button
        class="w-full"
        on:click={() => (expanded = !expanded)}
        aria-roledescription={ariaLabel}>
        <div class="flex items-center justify-between gap-x-2 text-start">
          <Header><slot name="header" /></Header>

          <DownArrow
            class="h-2 w-3 shrink-0 transform duration-100 {expanded
              ? 'rotate-0'
              : '-rotate-90'}" />
        </div>
      </button>

      <div class:hidden={!expanded} class="pt-1">
        <SmallDescription><slot name="description" /></SmallDescription>
      </div>
    </svelte:fragment>
    <slot name="content" slot="content" />
  </SidebarSectionBase>
</div>
