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
  import { afterNavigate } from '$app/navigation';
  import { postEvent } from '$lib/analytics';
  import { SITE_VERSION } from '$lib/config';
  import { lang } from '@intl/adobe-locales';
  import debug from 'debug';
  import { onMount } from 'svelte';
  import { locale } from 'svelte-i18n';
  import SidebarMenu from '../features/SidebarMenu/SidebarMenu.svelte';

  import '../app.css';
  import '../globalWebComponents';
  import ModalContainer from './verify/components/modals/ModalContainer/ModalContainer.svelte';

  afterNavigate(() => {
    let duration: number | null = null;

    if ('getEntriesByType' in window.performance) {
      const navPerf = window.performance?.getEntriesByType('navigation')?.[0];
      duration = navPerf?.duration;
    }

    postEvent({
      'event.type': 'render',
      'event.subtype': 'page',
      ...(duration ? { 'event.value': duration } : {}),
    });

    return true;
  });

  onMount(() => {
    // @TODO: can't import serverside - look into this
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

<div class="font-base leading-4">
  <slot />

  <SidebarMenu />

  <ModalContainer />
</div>
