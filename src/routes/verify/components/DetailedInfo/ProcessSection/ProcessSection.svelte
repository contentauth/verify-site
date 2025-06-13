<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import CollapsibleSection from '$src/components/SidebarSection/CollapsibleSection.svelte';
  import type { AssetData, ManifestData } from '$src/lib/asset';
  import { _, locale } from 'svelte-i18n';
  import AiSubSection from './AISubSection.svelte';
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
    {#if manifestData.generativeInfo?.softwareAgents?.length}
      <AiSubSection
        softwareAgents={manifestData.generativeInfo.softwareAgents} />
    {/if}
    {#await manifestData.editsAndActivityForLocale($locale ?? null) then result}
      <div data-testid="actions.editsAndActivity">
        {#if result && result.editsAndActivity.length}
          <ActionsSection
            editsAndActivity={result.editsAndActivity}
            hasInference={result.hasInference}
            reviewRatings={manifestData.reviewRatings} />
        {/if}
      </div>
    {/await}
    {#if ingredients.length}
      <IngredientsSection {ingredients} />
    {/if}
  </svelte:fragment>
</CollapsibleSection>
