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
  import AssetInfoDate from './AssetInfoDate.svelte';
  import AssetInfoThumbnailBase from './AssetInfoThumbnailBase.svelte';

  export let assetData: AssetData;
  export let highlighted = false;
  $: date = assetData.manifestData?.date;

  console.log('small', date);
</script>

<AssetInfoThumbnailBase {assetData} {highlighted}>
  <Body slot="name"><slot name="name" /></Body>

  <Body slot="date">
    {#if date}
      <AssetInfoDate {date} />{/if}</Body>
</AssetInfoThumbnailBase>
