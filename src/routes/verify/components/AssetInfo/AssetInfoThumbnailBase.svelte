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
  import SmallThumbnail from '../Thumbnail/SmallThumbnail.svelte';
  import AssetInfoBase from './AssetInfoBase.svelte';

  export let assetData: AssetData;
  export let highlighted = false;
</script>

<AssetInfoBase {assetData}>
  <SmallThumbnail
    thumbnail={assetData.thumbnail}
    mimeType={assetData.mimeType}
    {highlighted}
    slot="thumbnail" />
  <slot slot="name" name="name" />
</AssetInfoBase>
