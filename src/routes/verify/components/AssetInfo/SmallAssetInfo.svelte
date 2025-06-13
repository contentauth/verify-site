<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Body from '$src/components/typography/Body.svelte';
  import type { AssetData } from '$src/lib/asset';
  import type { Fallback } from '../Thumbnail/ThumbnailImage.svelte';
  import AssetInfoDate from './AssetInfoDate.svelte';
  import AssetInfoThumbnailBase from './AssetInfoThumbnailBase.svelte';

  export let assetData: AssetData;
  export let highlighted = false;
  export let hideNoCrStatus = false;
  export let fallbackThumbnail: Fallback = null;

  $: date = assetData.manifestData?.date;
  $: issuer = assetData.manifestData?.signatureInfo?.issuer;
</script>

<AssetInfoThumbnailBase
  {assetData}
  {highlighted}
  {hideNoCrStatus}
  fallback={fallbackThumbnail}>
  <Body slot="name"><slot name="name" /></Body>

  <Body slot="CRInfo">
    {#if date}
      <AssetInfoDate {date} />{:else}{issuer}{/if}</Body>
</AssetInfoThumbnailBase>
