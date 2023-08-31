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
  import type { Readable } from 'svelte/store';
  import type { CompareSelectedAssetStore } from '../../../stores/compareSelectedAsset';

  export let selectedAssets: Readable<(CompareSelectedAssetStore | null)[]>;

  let primaryAsset: CompareSelectedAssetStore | null;
  let secondaryAsset: CompareSelectedAssetStore | null;

  $: {
    [primaryAsset, secondaryAsset] = $selectedAssets;
  }
</script>

<div>
  {#if primaryAsset !== null}
    <button on:click={$primaryAsset?.select}>
      <img src={$primaryAsset?.thumbnail} alt={$primaryAsset?.title} />
    </button>
  {:else}
    None
  {/if}
</div>
<div>
  {#if secondaryAsset !== null}
    <button on:click={$secondaryAsset?.select}>
      <img src={$secondaryAsset?.thumbnail} alt={$secondaryAsset?.title} />
    </button>
  {:else}
    None
  {/if}
</div>
