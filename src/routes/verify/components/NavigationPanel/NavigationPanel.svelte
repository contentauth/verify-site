<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Body from '$src/components/typography/Body.svelte';
  import Link from '$src/components/typography/Link.svelte';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { verifyStore } from '../../stores';
  import LeftPanelContent from './LeftPanel/LeftPanelContent.svelte';

  export let isScrolled = false;

  const { hierarchyView } = verifyStore;

  const dispatch = createEventDispatcher();
</script>

<div
  class="sticky top-0 bg-white p-5 transition-shadow duration-200"
  class:shadow={isScrolled}>
  <Body>
    <button
      on:click={() => dispatch('launchFilePicker')}
      class="inline text-left"
      ><Link>{$_('sidebar.verify.selectFileLink')}</Link>
      <span class="hidden text-gray-600 lg:inline"
        >{$_('sidebar.verify.dragDrop')}</span
      ></button>
  </Body>
</div>
{#if $hierarchyView.state === 'success'}
  <LeftPanelContent />
{/if}
