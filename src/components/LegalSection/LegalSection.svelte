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
  import sunIcon from '$assets/svg/monochrome/sun.svg';
  import { _ } from 'svelte-i18n';
  import SmallDescription from '../typography/SmallDescription.svelte';

  let readMore = false;
</script>

<div class="flex p-5">
  <img src={sunIcon} alt="" class="self-start pe-2" />
  <div>
    <div>
      <SmallDescription>
        <slot name="legal-text-visible" />
        {#if readMore}
          <slot name="legal-text-more" />
        {/if}
      </SmallDescription>
    </div>
    <button on:click={() => (readMore = !readMore)}>
      <SmallDescription>
        <span class="font-bold underline"
          >{readMore
            ? $_('sidebar.legal.less')
            : $_('sidebar.legal.more')}</span>
      </SmallDescription>
    </button>
  </div>
</div>
