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
  import close from '$assets/svg/color/logos/close.svg';
  import Body from '$src/components/typography/Body.svelte';
  import type { AssetData } from '$src/lib/asset';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { Readable } from 'svelte/store';
  import { verifyStore } from '../../stores';
  import BigAssetInfo from '../AssetInfo/BigAssetInfo.svelte';
  import ErrorBanner from '../ErrorBanner/ErrorBanner.svelte';
  import ThumbnailSection from '../Thumbnail/ThumbnailSection.svelte';
  import AboutSection from './AboutSection/AboutSection.svelte';
  import AdvancedSection from './AdvancedSection/AdvancedSection.svelte';
  import CameraCaptureSection from './CameraCaptureSection/CameraCaptureSection.svelte';
  import ContentSummarySection, {
    assetDataToProps as assetDataToContentSummaryProps,
  } from './ContentSummarySection/ContentSummarySection.svelte';
  import CreditAndUsage from './CreditAndUsageSection/CreditAndUsageSection.svelte';
  import ProcessSection from './ProcessSection/ProcessSection.svelte';

  export let assetData: Readable<AssetData>;
  $: statusCode = $assetData.validationResult?.statusCode;
  $: isValid = statusCode === 'valid';
  $: isIncomplete = statusCode === 'incomplete';
  $: isInvalid = statusCode === 'invalid';

  const dispatch = createEventDispatcher();
  const { hierarchyView } = verifyStore;

  $: ingredients =
    $hierarchyView.state === 'success'
      ? $hierarchyView.ingredientsForAssetId($assetData.id)
      : [];

  function handleCloseClick() {
    dispatch('close');
  }
</script>

<div class="sticky top-0 z-30 shadow">
  <div class="flex h-20 shrink-0 items-center justify-between bg-gray-50 px-6">
    {#if $assetData}
      <BigAssetInfo assetData={$assetData}>
        <svelte:fragment slot="name">{$assetData.title}</svelte:fragment
        ></BigAssetInfo>
    {/if}
    <button on:click={handleCloseClick}>
      <img
        src={close}
        class="h-[1.15rem] w-[1.15rem] sm:hidden"
        alt={$_('sidebar.verify.hideInfo')} /></button>
  </div>
  {#if isIncomplete}
    <ErrorBanner
      ><Body><span class="text-white">{$_('error.incomplete')}</span></Body
      ></ErrorBanner>
  {:else if isInvalid}
    <ErrorBanner type="warning"
      ><Body><span class="text-white">{$_('error.invalid')} </span></Body
      ></ErrorBanner>
  {/if}
</div>
<ThumbnailSection thumbnail={$assetData.thumbnail} />
{#if $assetData.manifestData && isValid}
  <ContentSummarySection {...assetDataToContentSummaryProps($assetData)} />
  <CreditAndUsage manifestData={$assetData.manifestData} />
  <ProcessSection manifestData={$assetData.manifestData} {ingredients} />
  <CameraCaptureSection manifestData={$assetData.manifestData} />
  <AboutSection manifestData={$assetData.manifestData} />
  <AdvancedSection />
{:else}
  <div class="p-5">
    <Body>
      {#if isIncomplete}
        {$_('assetInfo.incomplete')}
      {:else if isInvalid}
        {$_('assetInfo.invalid')}
      {:else}
        {$_('sidebar.verify.noCCFile')}
      {/if}
    </Body>
  </div>
{/if}
