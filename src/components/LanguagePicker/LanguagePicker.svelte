<script lang="ts">
  import DownArrow from '$assets/svg/monochrome/down-arrow.svg?component';
  import { getLanguageNames, setLanguage } from '$lib/i18n';
  import Footer from '$src/components/typography/Footer.svelte';
  import { analytics } from '$src/lib/analytics';
  import { _, locale } from 'svelte-i18n';

  let expanded = false;
  let selectElement: HTMLSelectElement;

  const languageNames = getLanguageNames();

  $: currentLocale = $locale;

  function handleLanguageChange(evt: Event) {
    const lang = (evt.target as HTMLSelectElement).value;
    analytics.track('setLanguage', {
      lang,
      context: 'dropdown',
    });
    setLanguage(lang);
  }

  function handleButtonClick() {
    selectElement.click();
  }

  function handleKeyPress(evt: KeyboardEvent) {
    if (evt.code === 'Space') {
      selectElement.focus();
      selectElement.click();
    }
  }
</script>

<div class="relative">
  <button
    class="pointer-events-none flex h-5 items-center space-x-1.5"
    on:keypress={handleKeyPress}
    on:click={handleButtonClick}>
    <label for="language"
      ><Footer
        ><span class="cursor-pointer select-none underline"
          >{$_('languagePicker.changeLanguage')}</span
        ></Footer
      ></label>
    <DownArrow
      class="relative w-2 transform duration-100 {expanded
        ? 'rotate-180'
        : '-rotate-0'}" />
  </button>
  <select
    id="language"
    bind:this={selectElement}
    class="bottom:0 absolute left-0 top-0 h-5 opacity-0"
    aria-label={$_('aria.label.languageSelector')}
    on:change={handleLanguageChange}>
    {#each languageNames as { locale, name }}
      <option value={locale} selected={currentLocale === locale}>{name}</option>
    {/each}
  </select>
</div>
