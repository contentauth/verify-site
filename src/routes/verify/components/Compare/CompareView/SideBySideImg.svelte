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
  import type { CompareSelectedAssetStore } from '../../../stores/compareSelectedAsset';
  import NullState from './NullState.svelte';

  export let asset: CompareSelectedAssetStore | null;
</script>

{#if asset && $asset?.thumbnail?.url}
  <button
    on:click={$asset?.select}
    class={[$asset?.isActive ? 'inset-2 ring-2 ring-blue-800' : ''].join(' ')}>
    <img
      src={$asset?.thumbnail?.url}
      alt={$asset?.title}
      class="h-[45vh] w-full object-contain" />
  </button>
{:else}
  <NullState />
{/if}
