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
  import FormattedDateTime from '$src/components/FormattedDateTime/FormattedDateTime.svelte';
  import CollapsibleSection from '$src/components/SidebarSection/CollapsibleSection.svelte';
  import type { ManifestData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import SubSection from '../../SubSection/SubSection.svelte';

  export let manifestData: ManifestData;

  $: exif = manifestData.exif;
  $: captureDetails = exif?.captureDetails;
  $: dimensions =
    captureDetails?.width && captureDetails?.height
      ? [captureDetails.width, captureDetails.height].join(' x ')
      : null;
</script>

{#if exif}
  <CollapsibleSection>
    <svelte:fragment slot="header"
      >{$_('sidebar.cameraCapture')}</svelte:fragment>
    <svelte:fragment slot="description">
      {$_('sidebar.verify.cameraCapture.description')}</svelte:fragment>
    <svelte:fragment slot="content">
      {#if exif.creator}
        <SubSection
          ><svelte:fragment slot="title">
            {$_('sidebar.verify.cameraCapture.creator')}
          </svelte:fragment>
          <div class="break-word" slot="content">{exif.creator}</div>
        </SubSection>
      {/if}
      {#if exif.copyright}
        <SubSection
          ><svelte:fragment slot="title">
            {$_('sidebar.verify.cameraCapture.copyright')}
          </svelte:fragment>
          <div class="break-word" slot="content">{exif.copyright}</div>
        </SubSection>
      {/if}
      {#if exif.captureDate}
        <SubSection
          ><svelte:fragment slot="title">
            {$_('sidebar.verify.cameraCapture.captureDate')}
          </svelte:fragment>
          <div class="break-word" slot="content">
            <FormattedDateTime date={exif.captureDate} />
          </div>
        </SubSection>
      {/if}
      {#if captureDetails?.cameraModel || captureDetails?.lensModel || dimensions}
        <div class="mt-5 space-y-2 rounded bg-gray-100 p-3">
          {#if captureDetails?.cameraModel}
            <div>{captureDetails.cameraModel}</div>
          {/if}
          {#if captureDetails?.lensModel}
            <div>{captureDetails.lensModel}</div>
          {/if}
          {#if dimensions}
            <div>{dimensions}</div>
          {/if}
          <div
            class="mt-2 flex w-full justify-between border-t border-gray-200 pt-2">
            {#if captureDetails?.iso}
              <div>ISO {captureDetails.iso}</div>
            {/if}
            {#if captureDetails?.focalLength}
              <div>{captureDetails.focalLength}mm</div>
            {/if}
            {#if captureDetails?.fNumber}
              <div>f/{captureDetails.fNumber}</div>
            {/if}
            {#if captureDetails?.exposureTime}
              <div>
                {captureDetails.exposureTime}
                {$_('sidebar.verify.cameraCapture.secondSuffix')}
              </div>
            {/if}
          </div>
        </div>
      {/if}
      {#if exif.mapUrl}
        <SubSection
          ><svelte:fragment slot="title">
            {$_('sidebar.verify.cameraCapture.approximateLocation')}
          </svelte:fragment>
          <div slot="content">
            <img
              src={exif.mapUrl}
              alt={$_('sidebar.verify.cameraCapture.mapAltText')}
              class="h-auto w-full rounded" />
          </div>
        </SubSection>
      {/if}
    </svelte:fragment>
  </CollapsibleSection>
{/if}
