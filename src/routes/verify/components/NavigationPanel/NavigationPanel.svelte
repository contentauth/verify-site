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
  import LegalSection from '$src/components/LegalSection/LegalSection.svelte';
  import { sidebarLayoutPageState } from '$src/features/SidebarLayout';
  import type { AssetData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import { verifyStore } from '../../stores';
  import ManifestRecoveryItem from '../ManifestRecoveryItem.svelte';
  import ManifestRecoverySection from './ManifestRecovery/ManifestRecoverySection.svelte';

  const { recoveredManifestResults } = verifyStore;

  export let assetData: AssetData;

  async function handleRecovery() {
    verifyStore.recoverManifests();
  }
</script>

{#if assetData}
  <ManifestRecoverySection {assetData} />
{/if}
<LegalSection>
  <svelte:fragment slot="legal-text-visible">
    <p>{$_('sidebar.verify.legal.part1')}</p>
  </svelte:fragment>
  <svelte:fragment slot="legal-text-more">
    <p class="pt-2">{$_('sidebar.verify.legal.part2')}</p>
    <p class="pt-2">{$_('sidebar.verify.legal.part3')}</p>
  </svelte:fragment>
</LegalSection>
<button
  class="m-2 bg-blue-600 p-2 text-white lg:hidden"
  on:click={() => sidebarLayoutPageState.next()}>NEXT</button>
<button class="m-2 bg-blue-600 p-2 text-white" on:click={handleRecovery}
  >Recover manifests</button>
{#if $recoveredManifestResults.state === 'success'}
  {#each $recoveredManifestResults.manifests as manifest}
    <ManifestRecoveryItem recoveredManifestStore={manifest} />
  {/each}
{:else if $recoveredManifestResults.state === 'loading'}
  Loading
{/if}
