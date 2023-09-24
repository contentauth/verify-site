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
  import DropFileIcon from '$assets/svg/monochrome/drop-file.svg?component';
  import { SUPPORTED_FORMATS } from '$lib/asset';
  import Informational from '$src/components/typography/Informational.svelte';
  import Link from '$src/components/typography/Link.svelte';
  import Subtitle from '$src/components/typography/Subtitle.svelte';
  import Title from '$src/components/typography/Title.svelte';
  import { DEFAULT_LOCALE } from '$src/lib/i18n';
  import { uniq } from 'lodash';
  import { createEventDispatcher } from 'svelte';
  import { _, locale } from 'svelte-i18n';

  const dispatch = createEventDispatcher();

  $: compare = new Intl.Collator($locale ?? DEFAULT_LOCALE).compare;
  $: delimiter = $_('wordListDelimiter');
  $: formats = uniq(
    Object.keys(SUPPORTED_FORMATS).map(
      (mimeType) => SUPPORTED_FORMATS[mimeType].name,
    ),
  )
    .sort(compare)
    .join(delimiter);
</script>

<div class="flex h-full w-full items-center justify-center px-5">
  <div
    class="flex max-w-[36rem] flex-col items-center space-y-5 text-center lg:max-w-[72.9rem] lg:flex-row lg:gap-x-12 lg:text-left">
    <div class="space-y-5">
      <h1>
        <Title
          ><span class="lg:text-[2.5rem]">{$_('emptyState.title')}</span
          ></Title>
      </h1>
      <div><Subtitle>{$_('emptyState.body')}</Subtitle></div>
      <div><Informational>{$_('emptyState.footer')}</Informational></div>
    </div>
    <button
      id="drop-area"
      on:click={() => dispatch('launchFilePicker')}
      class="hover:border-brand-blue grid grid-cols-1 grid-rows-[auto_auto] rounded-3xl border border-dashed border-gray-600 p-[1.88rem] text-center transition-colors duration-200 hover:bg-brand-blue/10 lg:h-[24.4rem] lg:w-[38.5rem] lg:shrink-0 lg:grid-cols-[auto_auto] lg:grid-rows-1 lg:items-center lg:gap-x-2.5 lg:px-20 lg:text-left">
      <DropFileIcon
        class="h-[5.625rem] w-[5.625rem] justify-self-center text-gray-500 lg:justify-self-end" />
      <div>
        <Subtitle>
          <Link>
            <label
              for="drop-area"
              class="cursor-pointer text-subtitle underline"
              >{$_('emptyState.dropFile.linkText')}</label>
          </Link>
          <span class="hidden lg:block">{$_('emptyState.dropFile')}</span>
        </Subtitle>
        <div class="mt-2">
          <Informational>{$_('emptyState.formats')} {formats}</Informational>
        </div>
      </div>
    </button>
  </div>
</div>
