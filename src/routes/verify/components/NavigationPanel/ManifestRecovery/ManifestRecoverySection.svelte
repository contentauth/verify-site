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
  import ClosedBorderSection from '$src/components/SidebarSection/ClosedBorderSection.svelte';
  import type { AssetData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import SmallAssetInfo from '../../AssetInfo/SmallAssetInfo.svelte';
  import SearchForMatches from './SearchForMatches.svelte';

  export let assetData: AssetData;
</script>

<ClosedBorderSection>
  <div slot="title" class="pb-2">
    {$_('sidebar.verify.title')}
  </div>
  <svelte:fragment slot="content">
    <SmallAssetInfo {assetData}>
      <svelte:fragment slot="name"
        >{assetData.title ?? $_('asset.defaultTitle')}</svelte:fragment
      ></SmallAssetInfo>
    <SearchForMatches />
  </svelte:fragment>
</ClosedBorderSection>
