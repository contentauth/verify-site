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
