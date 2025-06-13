<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import CollapsibleSection from '$src/components/SidebarSection/CollapsibleSection.svelte';
  import type { ManifestData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import IssuedBySection from './IssuedBySection.svelte';
  import IssuedOnSection from './IssuedOnSection.svelte';

  export let manifestData: ManifestData;
</script>

<CollapsibleSection>
  <svelte:fragment slot="header">
    {$_('sidebar.verify.about')}</svelte:fragment>
  <svelte:fragment slot="content">
    {#if manifestData.signatureInfo?.issuer}
      <IssuedBySection issuedBy={manifestData.signatureInfo?.issuer} />
    {/if}
    {#if manifestData.date}
      <IssuedOnSection date={manifestData.date} />
    {/if}
  </svelte:fragment>
</CollapsibleSection>
