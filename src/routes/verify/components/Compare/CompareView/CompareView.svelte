<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import { compareViewMode } from '$src/routes/verify/stores/compareView';
  import type { Readable } from 'svelte/store';
  import type { CompareSelectedAssetStore } from '../../../stores/compareSelectedAsset';
  import SideBySide from './SideBySide.svelte';
  import Slider from './Slider/SliderView.svelte';

  export let selectedAssets: Readable<(CompareSelectedAssetStore | null)[]>;
</script>

<div class="flex h-full flex-col justify-center">
  {#if $compareViewMode === 'slider'}
    <Slider {selectedAssets} />
  {:else}
    <SideBySide {selectedAssets} />
  {/if}
</div>
