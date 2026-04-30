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
  export let trustSource: 'official' | 'legacy' | 'none' = 'none';

  // Extract extended X.509 fields (Catching various Rust/JS SDK naming conventions)
  $: sigInfo = manifestData.signatureInfo as any;
  $: orgUnit = sigInfo?.organization_unit || sigInfo?.organizational_unit || sigInfo?.organizationUnit || sigInfo?.org_unit || sigInfo?.ou;
  $: country = sigInfo?.country || sigInfo?.country_name || sigInfo?.countryName || sigInfo?.c;
</script>

<CollapsibleSection>
  <svelte:fragment slot="header">
    {$_('sidebar.verify.about')}</svelte:fragment>
  <svelte:fragment slot="content">
    {#if manifestData.signatureInfo?.common_name || manifestData.signatureInfo?.issuer}
      <IssuedBySection 
        commonName={manifestData.signatureInfo?.common_name} 
        issuer={manifestData.signatureInfo?.issuer}
        organizationalUnit={orgUnit}
        country={country}
        {trustSource} 
      />
    {/if}
    {#if manifestData.date}
      <IssuedOnSection date={manifestData.date} />
    {/if}
  </svelte:fragment>
</CollapsibleSection>
