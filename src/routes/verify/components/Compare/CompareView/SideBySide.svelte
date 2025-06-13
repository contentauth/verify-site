<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
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
  $: ariaLabel = $_('sidebar.verify.compare.view.ariaLabel', {
    values: { primaryTitle: primaryTitle, secondaryTitle: secondaryTitle },
  });
</script>

<div class="flex w-full flex-col" aria-label={ariaLabel}>
  <div class="flex justify-center px-6 pb-1">
    <SideBySideImg asset={primaryAsset} />
  </div>
  <div class="flex justify-center px-6">
    <SideBySideImg asset={secondaryAsset} />
  </div>
</div>
