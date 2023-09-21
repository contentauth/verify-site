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
  import type { ManifestData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import AiSubSection from './AISubSection.svelte';
  import ProducerSubSection from './ProducerSubSection.svelte';
  import SocialSubSection from './SocialSubSection.svelte';
  import Web3SubSection from './Web3/Web3SubSection.svelte';

  export let manifestData: ManifestData;

  $: shouldShowSection =
    manifestData.producer ||
    manifestData.socialAccounts?.length ||
    manifestData.generativeInfo?.softwareAgents?.length ||
    manifestData.web3Accounts.length || 
    manifestData.website;
</script>

{#if shouldShowSection}
  <CollapsibleSection>
    <svelte:fragment slot="header">{$_('sidebar.credit')}</svelte:fragment>
    <svelte:fragment slot="description">
      {$_('sidebar.verify.credit.description')}</svelte:fragment>
    <svelte:fragment slot="content">
      {#if manifestData.producer}
        <ProducerSubSection producer={manifestData.producer} />
      {/if}
      {#if manifestData.socialAccounts?.length}
        <SocialSubSection socialAccounts={manifestData.socialAccounts} />
      {/if}
      {#if manifestData.generativeInfo?.softwareAgents?.length}
        <AiSubSection
          softwareAgents={manifestData.generativeInfo.softwareAgents} />
      {/if}
      {#if manifestData.web3Accounts.length}
        <Web3SubSection web3Accounts={manifestData.web3Accounts} />
      {/if}
      {#if manifestData.website}
        <WebsiteSubSection website={manifestData.website} />
      {/if}
    </svelte:fragment>
  </CollapsibleSection>
{/if}
