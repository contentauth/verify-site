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
