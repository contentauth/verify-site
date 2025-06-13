<!--
Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->

<script lang="ts">
  import type { AssetData } from '$lib/asset';
  import Header from '$src/components/Header/Header.svelte';
  import { _ } from 'svelte-i18n';
  import type { Readable } from 'svelte/store';

  export let assetStore: Readable<AssetData>;
</script>

<div class="bg-gray-50 flex h-20 items-center border-b-2 px-6 shadow">
  <Header>{$assetStore.title ?? $_('asset.defaultTitle')}</Header>
</div>
