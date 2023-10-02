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
  import CollapsibleSection from '$src/components/SidebarSection/CollapsibleSection.svelte';
  import type { AssetData, ManifestData } from '$src/lib/asset';
  import { _, locale } from 'svelte-i18n';
  import ActionsSection from './ActionsSection.svelte';
  import AppDeviceSection from './AppDeviceSection.svelte';
  import IngredientsSection from './IngredientsSection.svelte';

  export let manifestData: ManifestData;
  export let ingredients: AssetData[];
</script>

<CollapsibleSection>
  <svelte:fragment slot="header">
    {$_('sidebar.process')}</svelte:fragment>
  <svelte:fragment slot="description">
    {$_('sidebar.verify.process.description')}</svelte:fragment>
  <svelte:fragment slot="content">
    {#if manifestData.claimGenerator}
      <AppDeviceSection generator={manifestData.claimGenerator} />
    {/if}
    {#await manifestData.editsAndActivityForLocale($locale ?? null) then editsAndActivity}
      {#if editsAndActivity?.length}
        <ActionsSection
          {editsAndActivity}
          reviewRatings={manifestData.reviewRatings} />
      {/if}
    {/await}
    {#if ingredients.length}
      <IngredientsSection {ingredients} />
    {/if}
  </svelte:fragment>
</CollapsibleSection>
