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
  import Body from '$src/components/typography/Body.svelte';
  import Link from '$src/components/typography/Link.svelte';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { verifyStore } from '../../stores';
  import ManifestRecoverySection from './ManifestRecovery/ManifestRecoverySection.svelte';

  export let isScrolled = false;
  export let hideManifestRecovery = false;

  const { hierarchyView } = verifyStore;

  const dispatch = createEventDispatcher();
</script>

<div
  class="sticky top-0 z-10 bg-white p-5 transition-shadow duration-200"
  class:shadow={isScrolled}>
  <Body>
    <button
      on:click={() => dispatch('launchFilePicker')}
      class="inline text-left"
      ><Link>{$_('sidebar.verify.selectFileLink')}</Link>
      <span class="hidden text-gray-600 lg:inline"
        >{$_('sidebar.verify.dragDrop')}</span
      ></button>
  </Body>
</div>
{#if $hierarchyView.state === 'success' && !hideManifestRecovery}
  <ManifestRecoverySection />
{/if}
