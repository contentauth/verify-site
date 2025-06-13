<!--
Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
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
      <span slot="name" {title}>{title}</span>
    </SmallAssetInfo>
  </button>
</div>
