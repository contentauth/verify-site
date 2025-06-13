<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import type { AssetData } from '$src/lib/asset';
  import SmallThumbnail from '../Thumbnail/SmallThumbnail.svelte';
  import type { Fallback } from '../Thumbnail/ThumbnailImage.svelte';
  import AssetInfoBase from './AssetInfoBase.svelte';

  export let assetData: AssetData;
  export let highlighted = false;
  export let hideThumbnail = false;
  export let hideNoCrStatus = false;
  export let fallback: Fallback = null;
</script>

<AssetInfoBase {assetData} {hideThumbnail} {hideNoCrStatus}>
  <SmallThumbnail
    thumbnail={assetData.thumbnail}
    mimeType={assetData.mimeType}
    {fallback}
    {highlighted}
    slot="thumbnail" />
  <slot slot="name" name="name" />
  <slot slot="CRInfo" name="CRInfo" />
</AssetInfoBase>
