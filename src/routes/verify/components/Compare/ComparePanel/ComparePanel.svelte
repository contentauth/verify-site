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
  import BackArrow from '$assets/svg/monochrome/back-arrow.svg?component';
  import Header from '$src/components/typography/Header.svelte';
  import { _ } from 'svelte-i18n';
  import { verifyStore } from '../../../stores';
  import type { CompareAssetStoreMap } from '../../../stores/compareView';
  import CompareAsset from './CompareAsset.svelte';

  export let assetStoreMap: CompareAssetStoreMap;
</script>

<div class="overflow-auto">
  <button class="me-2" on:click={() => verifyStore.setHierarchyView()}>
    <div class="flex px-2 py-5">
      <BackArrow class="me-2" />
      <Header>{$_('sidebar.verify.compare')}</Header>
    </div>
  </button>

  <CompareAsset
    compareAssetStore={assetStoreMap[0]}
    compareAssetStoreMap={assetStoreMap} />
</div>
