<!--
  ADOBE CONFIDENTIAL
  Copyright 2023 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
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
        <div class="pb-2">
          <Header><slot name="title" /></Header>
        </div>
      {/if}
    </div>

    <slot name="content" slot="content" /></SidebarSectionBase>
</div>
