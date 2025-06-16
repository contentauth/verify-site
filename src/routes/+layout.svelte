<!--
Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import { SITE_VERSION, getLocalFeatures } from '$lib/config';
  import { ToastContainer } from '$src/features/Toast';
  import { lang } from '@intl/adobe-locales';
  import debug from 'debug';
  import { onMount } from 'svelte';
  import { locale } from 'svelte-i18n';
  import SidebarMenu from '../features/SidebarMenu/SidebarMenu.svelte';
  import ModalContainer from './verify/components/modals/ModalContainer/ModalContainer.svelte';

  import '../app.css';
  import '../globalWebComponents';

  $: localFeatures = getLocalFeatures();
  let showLocalFeatureWarning = true;

  onMount(() => {
    // @TODO: can't import server side - look into this
    console.debug(`Verify site running revision ${SITE_VERSION}`);

    const unsubscribe = locale.subscribe((loc) => {
      if (loc) {
        const language = lang(loc);
        debug('i18n')(`Setting html tag language to ${language}`);
        document.documentElement.setAttribute('lang', language);
      }
    });

    return unsubscribe;
  });
</script>

{#if showLocalFeatureWarning && localFeatures.length > 0}
  <div
    class="pointer-events-none fixed top-0 z-50 flex w-screen justify-center">
    <div class="rounded-bl bg-brand-yellow px-4 py-2 text-informational">
      <span class="font-medium"
        >Local features are set: <pre
          class="inline font-thin">{localFeatures.join(', ')}</pre></span>
    </div>
    <button
      class="pointer-events-auto rounded-br bg-gray-900 px-4 py-2 text-informational text-brand-yellow underline"
      on:click={() => (showLocalFeatureWarning = false)}>Close</button>
  </div>
{/if}
<div class="font-base leading-4">
  <slot />

  <SidebarMenu />

  <ModalContainer />
  <ToastContainer />
</div>
