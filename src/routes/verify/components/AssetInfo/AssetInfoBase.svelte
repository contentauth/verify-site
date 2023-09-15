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
  import L1Incomplete from '$assets/svg/color/cr-icon-incomplete.svg?component';
  import L1Invalid from '$assets/svg/color/cr-icon-invalid.svg?component';
  import L1Icon from '$assets/svg/monochrome/cr-icon.svg?component';
  import FormattedDateTime from '$src/components/FormattedDateTime/FormattedDateTime.svelte';
  import Body from '$src/components/typography/Body.svelte';
  import Truncate from '$src/components/typography/Truncate.svelte';
  import type { AssetData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';

  export let assetData: AssetData;

  $: statusCode = assetData.validationResult?.statusCode;
  $: date = assetData.manifestData?.date;
</script>

<div class="flex items-center">
  <slot name="thumbnail" />
  <div class="w-full px-2">
    <div class="flex pb-0.5"><Truncate><slot name="name" /></Truncate></div>
    <div class="flex items-center text-gray-600">
      {#if statusCode === 'valid' && date}
        <L1Icon
          width="1rem"
          height="1rem"
          class="me-1.5 h-4 w-4 text-gray-600" />
        <Truncate
          ><Body
            ><span aria-label={$_('aria.label.signedOn')}
              ><FormattedDateTime {date} noTime /></span
            ></Body
          ></Truncate>
      {:else if statusCode === 'incomplete'}
        <L1Incomplete
          width="1.25rem"
          height="1rem"
          class="me-1.5 h-4 w-4 text-gray-600" />
        <div class="min-w-0 truncate">
          <Truncate
            ><Body
              ><span class="text-gray-600">{$_('assetInfo.incomplete')}</span
              ></Body
            ></Truncate>
        </div>
      {:else if statusCode === 'invalid'}
        <L1Invalid
          width="1.25rem"
          height="1rem"
          class="me-1.5 h-4 w-4 text-gray-600" />
        <Truncate
          ><Body
            ><span class="text-gray-600">{$_('assetInfo.invalid')}</span></Body
          ></Truncate>
      {:else}
        <Truncate
          ><Body
            ><span class="text-gray-600">{$_('sidebar.verify.noCC')}</span
            ></Body
          ></Truncate>
      {/if}
    </div>
  </div>
</div>
