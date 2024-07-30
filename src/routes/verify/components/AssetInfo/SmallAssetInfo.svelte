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
