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
  import IssuedBySection from './IssuedBySection.svelte';
  import IssuedOnSection from './IssuedOnSection.svelte';

  export let manifestData: ManifestData;
  export let isUntrusted: boolean;
</script>

<CollapsibleSection>
  <svelte:fragment slot="header">
    {$_('sidebar.verify.about')}</svelte:fragment>
  <svelte:fragment slot="content">
    {#if manifestData.signatureInfo?.issuer}
      <IssuedBySection
        issuedBy={manifestData.signatureInfo?.issuer}
        {isUntrusted} />
    {/if}
    {#if manifestData.date}
      <IssuedOnSection date={manifestData.date} />
    {/if}
  </svelte:fragment>
</CollapsibleSection>
