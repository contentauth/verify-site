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
  import { _ } from 'svelte-i18n';
  import type { Readable } from 'svelte/store';
  import type { CompareSelectedAssetStore } from '../../../stores/compareSelectedAsset';
  import SideBySideImg from './SideBySideImg.svelte';

  export let selectedAssets: Readable<(CompareSelectedAssetStore | null)[]>;
  let primaryAsset: CompareSelectedAssetStore | null;
  let secondaryAsset: CompareSelectedAssetStore | null;

  $: {
    [primaryAsset, secondaryAsset] = $selectedAssets;
  }
  $: primaryTitle = $primaryAsset
    ? $primaryAsset.title
    : $_('sidebar.verify.compare.noAssetSelected');
  $: secondaryTitle = $secondaryAsset
    ? $secondaryAsset.title
    : $_('sidebar.verify.compare.noAssetSelected');

  $: ariaLabel =
    primaryTitle +
    $_('sidebar.verify.compare.view.ariaLabel.part1') +
    secondaryTitle +
    $_('sidebar.verify.compare.view.ariaLabel.part2');
</script>

<div class="flex w-full flex-col" aria-label={ariaLabel}>
  <div class="flex justify-center px-6 pb-1">
    <SideBySideImg asset={primaryAsset} />
  </div>
  <div class="flex justify-center px-6">
    <SideBySideImg asset={secondaryAsset} />
  </div>
</div>
