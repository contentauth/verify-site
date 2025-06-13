<!--
Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Header from '$src/components/typography/Header.svelte';
  import type { AssetData } from '$src/lib/asset';
  import AssetInfoThumbnailBase from './AssetInfoThumbnailBase.svelte';

  export let assetData: AssetData;
  export let hideThumbnail = false;
</script>

<AssetInfoThumbnailBase {assetData} {hideThumbnail}>
  <Header slot="name"><slot name="name" /></Header>
  <slot slot="CRInfo" name="CRInfo" />
</AssetInfoThumbnailBase>
