<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
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
