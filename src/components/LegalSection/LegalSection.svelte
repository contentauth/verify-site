<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
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
          <div aria-live="polite"><slot name="legal-text-more" /></div>
        {/if}
      </SmallDescription>
    </div>
    <button on:click={() => (readMore = !readMore)}>
      <SmallDescription>
        <span class="font-medium underline"
          >{readMore
            ? $_('sidebar.legal.less')
            : $_('sidebar.legal.more')}</span>
      </SmallDescription>
    </button>
  </div>
</div>
