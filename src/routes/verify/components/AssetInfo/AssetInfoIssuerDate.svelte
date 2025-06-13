<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Description from '$src/components/typography/Description.svelte';
  import type { ManifestData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import AssetInfoDate from './AssetInfoDate.svelte';

  export let manifestData: ManifestData | null;
  $: date = manifestData?.date;
  $: issuer = manifestData?.signatureInfo?.issuer;
</script>

<Description>
  {$_('sidebar.verify.about.issuedby')}
  {issuer}
  {#if date}
    {$_('sidebar.verify.asset.date.on')} <AssetInfoDate {date} />{/if}
</Description>
