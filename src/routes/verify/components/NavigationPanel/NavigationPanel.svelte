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

  const { hierarchyView } = verifyStore;

  const dispatch = createEventDispatcher();
</script>

<div class="p-5">
  <Body>
    <button on:click={() => dispatch('launchFilePicker')}
      ><Link>{$_('sidebar.verify.selectFileLink')}</Link></button>
    <span class="hidden text-gray-600 lg:inline"
      >{$_('sidebar.verify.dragDrop')}</span>
  </Body>
</div>
{#if $hierarchyView.state === 'success'}
  <ManifestRecoverySection />
{/if}
