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
  import type { AssetData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import SmallAssetInfo from './AssetInfo/SmallAssetInfo.svelte';

  export let assetData: AssetData;
  export let isSelected = false;

  $: title = assetData.title ?? $_('asset.defaultTitle');
</script>

<div
  class:bg-blue-100={isSelected}
  class="-mx-5 box-content h-12 px-5 py-2 transition-colors">
  <button on:click class="w-full" data-testId="asset-info-btn">
    <SmallAssetInfo {assetData} highlighted={isSelected}>
      <span slot="name" {title}>{title}</span></SmallAssetInfo>
  </button>
</div>
