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
  import close from '$assets/svg/monochrome/close.svg';
  import Body from '$src/components/typography/Body.svelte';
  import type { AssetData } from '$src/lib/asset';
  import { createEventDispatcher, onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { openModal } from 'svelte-modals';
  import type { Readable } from 'svelte/store';
  import { verifyStore } from '../../stores';
  import BigAssetInfo from '../AssetInfo/BigAssetInfo.svelte';
  import ErrorBanner from '../ErrorBanner/ErrorBanner.svelte';
  import ThumbnailSection from '../Thumbnail/ThumbnailSection.svelte';
  import LightboxModal from '../modals/LightboxModal/LightboxModal.svelte';
  import AboutSection from './AboutSection/AboutSection.svelte';
  import CameraCaptureSection from './CameraCaptureSection/CameraCaptureSection.svelte';
  import ContentSummarySection, {
    assetDataToProps as assetDataToContentSummaryProps,
  } from './ContentSummarySection/ContentSummarySection.svelte';
  import CreditAndUsage from './CreditAndUsageSection/CreditAndUsageSection.svelte';
  import ProcessSection from './ProcessSection/ProcessSection.svelte';

  export let assetData: Readable<AssetData>;
  export let viewportElement: HTMLElement | undefined = undefined;

  let thumbnailElement: HTMLDivElement;
  let headerHeight: number;
  let hideHeaderThumbnail = true;

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

  onMount(() => {
    let observer: IntersectionObserver;

    if (viewportElement && thumbnailElement) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            hideHeaderThumbnail = entry.isIntersecting;
          });
        },
        {
          root: viewportElement,
          rootMargin: `${headerHeight}px 0px 0px 0px`,
          threshold: 0.8,
        },
      );
      observer.observe(thumbnailElement);
    }

    return () => {
      observer?.disconnect();
    };
  });

  function handleCloseClick() {
    dispatch('close');
  }

  function handleThumbnailClick() {
    if ($assetData.thumbnail) {
      openModal(LightboxModal, {
        src: $assetData.thumbnail,
        label: $assetData.title ?? $_('asset.defaultTitle'),
      });
    }
  }
</script>

<div
  bind:offsetHeight={headerHeight}
  class="sticky top-0 z-30 bg-white transition-shadow duration-300"
  class:shadow={!hideHeaderThumbnail}>
  <div class="bg-gray-50 flex h-20 shrink-0 items-center justify-between px-6">
    {#if $assetData}
      <BigAssetInfo assetData={$assetData} hideThumbnail={hideHeaderThumbnail}>
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
<div bind:this={thumbnailElement}>
  <ThumbnailSection
    thumbnail={$assetData.thumbnail}
    mimeType={$assetData.mimeType}
    on:click={handleThumbnailClick} />
</div>
{#if $assetData.manifestData && isValid}
  <ContentSummarySection {...assetDataToContentSummaryProps($assetData)} />
  <CreditAndUsage manifestData={$assetData.manifestData} />
  <ProcessSection manifestData={$assetData.manifestData} {ingredients} />
  <CameraCaptureSection manifestData={$assetData.manifestData} />
  <AboutSection manifestData={$assetData.manifestData} />
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
