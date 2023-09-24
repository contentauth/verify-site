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
  import type { AssetData } from '$lib/asset';
  import Header from '$src/components/Header/Header.svelte';
  import { _ } from 'svelte-i18n';
  import type { Readable } from 'svelte/store';

  export let assetStore: Readable<AssetData>;
</script>

<div class="bg-gray-50 flex h-20 items-center border-b-2 px-6 shadow">
  <Header>{$assetStore.title ?? $_('asset.defaultTitle')}</Header>
</div>
