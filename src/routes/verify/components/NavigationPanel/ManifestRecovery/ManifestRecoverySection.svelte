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
  import CloseIcon from '$assets/svg/monochrome/close.svg?component';
  import ClosedBorderSection from '$src/components/SidebarSection/ClosedBorderSection.svelte';
  import Spinner from '$src/components/Spinner/Spinner.svelte';
  import BodyBold from '$src/components/typography/BodyBold.svelte';
  import { sidebarLayoutPageState } from '$src/features/SidebarLayout';
  import { _ } from 'svelte-i18n';
  import { verifyStore } from '../../../stores';
  import AssetInfoButton from '../../AssetInfoButton.svelte';
  import SearchForMatches from './SearchForMatches.svelte';
  import SearchResults from './SearchResults.svelte';

  const { recoveredManifestResults, clearManifestResults, mostRecentlyLoaded } =
    verifyStore;

  async function handleRecovery() {
    verifyStore.recoverManifests();
  }
</script>

<ClosedBorderSection>
  <div slot="title" class="pb-2">
    {$_('sidebar.verify.title')}
  </div>
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
</ClosedBorderSection>
{#if $recoveredManifestResults.state === 'success'}
  <ClosedBorderSection>
    <div slot="title" class="mb-5 flex justify-between">
      <div class="text-md">
        <BodyBold>
          {$_('sidebar.verify.recovery.possibleMatches')}
        </BodyBold>
      </div>
      <button class="-me-1" on:click={clearManifestResults}
        ><CloseIcon width="1rem" height="1rem" /></button>
    </div>
    <div slot="content">
      <SearchResults results={$recoveredManifestResults.manifests} />
    </div>
  </ClosedBorderSection>
{:else if $recoveredManifestResults.state === 'loading'}
  <ClosedBorderSection>
    <div
      slot="content"
      class="relative top-0.5 origin-left scale-125"
      aria-label={$_('spinner.loading')}
      aria-live="polite">
      <Spinner size="s" />
    </div>
  </ClosedBorderSection>
{:else}
  <ClosedBorderSection>
    <SearchForMatches on:click={handleRecovery} slot="content" />
  </ClosedBorderSection>
{/if}
