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
  import { compareViewMode } from '$src/routes/verify/stores/compareView';
  import type { Readable } from 'svelte/store';
  import type { CompareSelectedAssetStore } from '../../../stores/compareSelectedAsset';
  import SideBySide from './Side-by-Side.svelte';
  import Slider from './Slider/SliderView.svelte';

  export let selectedAssets: Readable<(CompareSelectedAssetStore | null)[]>;
</script>

{#if $compareViewMode === 'slider'}
  <Slider {selectedAssets}></Slider>
{:else}
  <SideBySide {selectedAssets}></SideBySide>
{/if}
