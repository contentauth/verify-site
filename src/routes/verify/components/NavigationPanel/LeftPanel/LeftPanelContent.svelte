<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Section from '$src/components/SidebarSection/Section.svelte';
  import { sidebarLayoutPageState } from '$src/features/SidebarLayout';
  import { verifyStore } from '../../../stores';
  import AssetInfoButton from '../../AssetInfoButton.svelte';

  const { mostRecentlyLoaded } = verifyStore;
</script>

<Section hasPadding={false} hasBorder={false}>
  <svelte:fragment slot="content">
    {#if $mostRecentlyLoaded.assetData}
      <AssetInfoButton
        assetData={$mostRecentlyLoaded.assetData}
        on:click={() => {
          $mostRecentlyLoaded.select?.();
          sidebarLayoutPageState.next();
        }}
        isSelected={$mostRecentlyLoaded.isSelected} />
    {/if}
  </svelte:fragment>
</Section>
