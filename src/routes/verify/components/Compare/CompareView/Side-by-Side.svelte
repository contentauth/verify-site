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
  import NullState from './NullState.svelte';

  export let selectedAssets: Readable<(CompareSelectedAssetStore | null)[]>;

  let primaryAsset: CompareSelectedAssetStore | null;
  let secondaryAsset: CompareSelectedAssetStore | null;

  $: {
    [primaryAsset, secondaryAsset] = $selectedAssets;
  }
</script>

<div class="flex w-full flex-col">
  <div class="flex justify-center pb-1">
    {#if primaryAsset !== null}
      <button
        on:click={$primaryAsset?.select}
        class:border-2={$primaryAsset?.isActive}
        class:border-blue-800={$primaryAsset?.isActive}
        class="rounded">
        <img
          src={$primaryAsset?.thumbnail}
          alt={$primaryAsset?.title}
          class="h-[45vh] w-full object-contain" />
      </button>
    {:else}
      <NullState></NullState>
    {/if}
  </div>
  <div class="flex justify-center">
    {#if secondaryAsset !== null}
      <button
        on:click={$secondaryAsset?.select}
        class:border-2={$secondaryAsset?.isActive}
        class:border-blue-800={$secondaryAsset?.isActive}
        class="rounded">
        <img
          src={$secondaryAsset?.thumbnail}
          alt={$secondaryAsset?.title}
          class="h-[45vh] w-full object-contain" />
      </button>
    {:else}
      <NullState></NullState>
    {/if}
  </div>
</div>
