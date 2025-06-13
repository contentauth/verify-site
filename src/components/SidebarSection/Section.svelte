<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Header from '../typography/Header.svelte';
  import SidebarSectionBase from './SidebarSectionBase.svelte';

  export let hasBorder = true;
  export let hasPadding = true;
</script>

<div class="w-full px-5">
  <SidebarSectionBase {hasBorder} {hasPadding}>
    <div slot="headerSection">
      {#if $$slots.title}
        <div class="pb-2 text-start">
          <Header><slot name="title" /></Header>
        </div>
      {/if}
    </div>

    <slot name="content" slot="content" /></SidebarSectionBase>
</div>
