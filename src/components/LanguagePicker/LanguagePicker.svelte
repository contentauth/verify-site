<script lang="ts">
  import DownArrow from '$assets/svg/monochrome/down-arrow.svg?component';
  import { getLanguageNames, setLanguage } from '$lib/i18n';
  import Footer from '$src/components/typography/Footer.svelte';
  import { _, locale } from 'svelte-i18n';

  let expanded = false;

  const languageNames = getLanguageNames();

  $: currentLocale = $locale;

  function handleLanguageChange(evt: Event) {
    setLanguage((evt.target as HTMLSelectElement).value);
  }
</script>

<div class="pointer-events-none flex items-center">
  <label for="language" class="pe-1"
    ><Footer
      ><span class="cursor-pointer select-none underline"
        >{$_('languagePicker.changeLanguage')}</span
      ></Footer
    ></label>
  <DownArrow
    class="relative top-0.5 w-2 transform duration-100 {expanded
      ? 'rotate-180'
      : '-rotate-0'}" />
</div>
<div class="absolute inset-0 z-0 p-4">
  <select
    id="language"
    class="relative bottom-1 appearance-none bg-transparent px-5 py-2 text-transparent"
    aria-label={$_('aria.label.languageSelector')}
    on:change={handleLanguageChange}>
    {#each languageNames as { locale, name }}
      <option value={locale} selected={currentLocale === locale}>{name}</option>
    {/each}
  </select>
</div>
