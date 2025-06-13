<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import L1Icon from '$assets/svg/monochrome/cr-icon.svg?component';
  import Body from '$src/components/typography/Body.svelte';
  import Truncate from '$src/components/typography/Truncate.svelte';
  import type { AssetData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';

  export let assetData: AssetData;
  export let hideThumbnail = false;
  export let hideNoCrStatus = false;

  $: validationResult = assetData.validationResult;
  $: statusCode = validationResult?.statusCode;
  $: hasCredentials =
    !!assetData.manifestData?.signatureInfo?.cert_serial_number;
</script>

<div class="flex min-w-0 items-center">
  <div
    class={[
      `transition-all duration-300 ease-in-out motion-reduce:transition-none`,
      hideThumbnail
        ? `me-0 w-0 overflow-hidden opacity-0`
        : `me-2 w-auto opacity-100`,
    ].join(' ')}>
    <slot name="thumbnail" />
  </div>
  <div class="min-w-0">
    <div class="flex pb-0.5"><Truncate><slot name="name" /></Truncate></div>
    <div class="flex items-center text-gray-900">
      {#if statusCode === 'invalid'}
        <Truncate
          ><Body
            ><span class="text-gray-900" title={$_('assetInfo.invalid')}
              >{$_('assetInfo.invalid')}</span
            ></Body
          ></Truncate>
      {:else if statusCode === 'unrecognized'}
        <Truncate
          ><Body
            ><span class="text-gray-900" title={$_('assetInfo.invalid')}
              >{$_('assetInfo.unrecognized')}</span
            ></Body
          ></Truncate>
      {:else if statusCode === 'valid' && hasCredentials}
        <L1Icon
          width="1rem"
          height="1rem"
          class="me-1.5 h-4 w-4 shrink-0 text-gray-900" />
        <Truncate>
          <slot name="CRInfo" />
        </Truncate>
      {:else if !hideNoCrStatus}
        <Truncate
          ><Body
            ><span class="text-gray-600">{$_('sidebar.verify.noCC')}</span
            ></Body
          ></Truncate>
      {/if}
    </div>
  </div>
</div>
