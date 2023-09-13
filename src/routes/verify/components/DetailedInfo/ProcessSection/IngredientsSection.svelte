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
  import SubSection from '../../../components/SubSection/SubSection.svelte';
  import SmallAssetInfo from '../../AssetInfo/SmallAssetInfo.svelte';

  export let ingredients: AssetData[];
</script>

<SubSection>
  <svelte:fragment slot="title">
    {$_('sidebar.verify.process.ingredients')}</svelte:fragment>
  <div slot="content" class="flex flex-col gap-3">
    {#each ingredients as ingredient}
      <SmallAssetInfo assetData={ingredient}>
        <svelte:fragment slot="name"
          >{ingredient.title ?? $_('asset.defaultTitle')}</svelte:fragment
        ></SmallAssetInfo>
    {/each}
  </div></SubSection>
