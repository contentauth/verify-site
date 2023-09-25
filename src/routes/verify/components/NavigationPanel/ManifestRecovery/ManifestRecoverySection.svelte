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
  import Section from '$src/components/SidebarSection/Section.svelte';
  import Spinner from '$src/components/Spinner/Spinner.svelte';
  import Body from '$src/components/typography/Body.svelte';
  import BodyBold from '$src/components/typography/BodyBold.svelte';
  import { sidebarLayoutPageState } from '$src/features/SidebarLayout';
  import { SUPPORTED_FORMATS } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import { verifyStore } from '../../../stores';
  import AssetInfoButton from '../../AssetInfoButton.svelte';
  import SearchForMatches from './SearchForMatches.svelte';
  import SearchResults from './SearchResults.svelte';

  const { recoveredManifestResults, clearManifestResults, mostRecentlyLoaded } =
    verifyStore;

  $: mimeType = $mostRecentlyLoaded?.assetData?.mimeType ?? null;
  $: isSearchSupported = mimeType
    ? SUPPORTED_FORMATS[mimeType]?.searchable
    : false;
  $: delimiter = $_('wordListDelimiter');
  $: searchableFormats = Object.keys(SUPPORTED_FORMATS)
    .map((format) => SUPPORTED_FORMATS[format])
    .filter((format) => format.searchable)
    .map((format) => format.name)
    .join(delimiter);

  async function handleRecovery() {
    verifyStore.recoverManifests();
  }
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
{#if $recoveredManifestResults.state === 'success'}
  <Section hasBorder={false}>
    <div slot="title" class="text-md mb-5 flex justify-between">
      <BodyBold>
        {$_('sidebar.verify.recovery.possibleMatches')}
      </BodyBold>
      <button class="-me-1" on:click={clearManifestResults}
        ><CloseIcon width="1rem" height="1rem" /></button>
    </div>
    <div slot="content">
      <SearchResults results={$recoveredManifestResults.manifests} />
    </div>
  </Section>
{:else if $recoveredManifestResults.state === 'loading'}
  <Section hasBorder={false}>
    <div
      slot="content"
      class="relative top-0.5 origin-left scale-125"
      aria-label={$_('spinner.loading')}
      aria-live="polite">
      <Spinner size="s" />
    </div>
  </Section>
{:else if !isSearchSupported}
  <Section hasBorder={false}>
    <Body slot="content">
      {$_('sidebar.verify.recovery.searchNotSupported')}
      {searchableFormats}
    </Body>
  </Section>
{:else}
  <Section hasBorder={false}>
    <SearchForMatches on:click={handleRecovery} slot="content" />
  </Section>
{/if}
