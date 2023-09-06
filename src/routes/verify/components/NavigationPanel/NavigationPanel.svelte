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
  import { _ } from 'svelte-i18n';
  import { verifyStore } from '../../stores';
  import ManifestRecoverySection from './ManifestRecovery/ManifestRecoverySection.svelte';

  const { hierarchyView } = verifyStore;
</script>

{#if $hierarchyView.state === 'success'}
  <ManifestRecoverySection />
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
