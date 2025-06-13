<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Header from '../typography/Header.svelte';
  import SidebarSectionBase from './SidebarSectionBase.svelte';

  export let hasPadding = true;
</script>

<SidebarSectionBase {hasPadding}>
  <div slot="headerSection" class="px-5 text-start">
    <Header><slot name="title" /></Header>
  </div>
  <div slot="content" class="px-5">
    <slot name="content" />
  </div>
</SidebarSectionBase>
