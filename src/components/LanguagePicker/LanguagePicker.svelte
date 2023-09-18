<script lang="ts">
  import DownArrow from '$assets/svg/monochrome/down-arrow.svg?component';
  import { getLanguageNames, setLanguage } from '$lib/i18n';
  import { _, locale } from 'svelte-i18n';
  import Informational from '../typography/Informational.svelte';

  let expanded = false;

  const languageNames = getLanguageNames();

  $: currentLocale = $locale;

  function handleLanguageChange(evt: Event) {
    setLanguage((evt.target as HTMLSelectElement).value);
  }
</script>

<div class="relative border-t-2 border-gray-200 px-5 py-4">
  <div class="pointer-events-none flex items-center">
    <label for="language" class=" pe-1"
      ><Informational
        ><span class="cursor-pointer select-none underline"
          >{$_('languagePicker.changeRegion')}</span
        ></Informational
      ></label>
    <DownArrow
      class="relative top-0.5 w-2 transform duration-100 {expanded
        ? 'rotate-180'
        : '-rotate-0'}" />
  </div>
  <div class="absolute inset-0 z-10 p-4">
    <select
      id="language"
      class="bg-transparent text-transparent"
      on:change={handleLanguageChange}>
      {#each languageNames as { locale, name }}
        <option value={locale} selected={currentLocale === locale}
          >{name}</option>
      {/each}
    </select>
  </div>
</div>
