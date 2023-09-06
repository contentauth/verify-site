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
  import { ROOT_ID } from '$lib/asset';
  import type { ReadableRecoveredManifestStore } from '../../../stores/recoveredManifest';
  import AssetInfoButton from '../../AssetInfoButton.svelte';

  export let recoveredManifestStore: ReadableRecoveredManifestStore;

  $: assetData = $recoveredManifestStore.assetMap[ROOT_ID];
  $: isSelected = $recoveredManifestStore.isSelected;
</script>

<AssetInfoButton
  {assetData}
  {isSelected}
  on:click={$recoveredManifestStore.select} />
