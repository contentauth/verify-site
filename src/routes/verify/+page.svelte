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
  import { SidebarLayout } from '$src/features/SidebarLayout';
  import { _ } from 'svelte-i18n';
  import CompareDetailedInfo from './components/Compare/CompareInfo/CompareInfo.svelte';
  import ComparePanel from './components/Compare/ComparePanel/ComparePanel.svelte';
  import CompareView from './components/Compare/CompareView/CompareView.svelte';
  import DetailedInfo from './components/DetailedInfo/DetailedInfo.svelte';
  import DragDropOverlay from './components/DragDropOverlay/DragDropOverlay.svelte';
  import EmptyState from './components/EmptyState/EmptyState.svelte';
  import NavigationPanel from './components/NavigationPanel/NavigationPanel.svelte';
  import RevealablePanel from './components/RevealablePanel/RevealablePanel.svelte';
  import TreeView from './components/TreeView/TreeView.svelte';
  import { dragDropAction, type DragDropActionParams } from './lib/dragDrop';
  import { verifyStore } from './stores';

  let showDropOverlay = false;
  let showPanel = false;
  const { hierarchyView, compareView, viewState } = verifyStore;

  const dragDropParams: DragDropActionParams = {
    onDragStateChange(newState: boolean) {
      showDropOverlay = newState;
    },
  };

  $: hasEmptyState = $hierarchyView.state === 'none';

  // Check for `source` parameter and load that asset if it exists
  afterNavigate((nav: import('@sveltejs/kit').AfterNavigate) => {
    const { searchParams } = nav.to?.url ?? {};
    const source = searchParams?.get('source');

    if (!source) return;

    try {
      const sourceUrl = new URL(source);
      verifyStore.readC2paSource(sourceUrl.toString());
    } catch (err) {
      // Invalid source passed, ignore
      return;
    }
  });
</script>

<div use:dragDropAction={dragDropParams}>
  <DragDropOverlay visible={showDropOverlay} />
  <SidebarLayout leftColumnTakeover={hasEmptyState}>
    <svelte:fragment slot="header">{$_('page.verify.title')}</svelte:fragment>
    <svelte:fragment slot="sidebar">
      {#if $viewState === 'hierarchy'}
        {#if hasEmptyState}
          <EmptyState />
        {:else}
          <NavigationPanel />
        {/if}
      {:else if $viewState === 'compare' && $compareView.state === 'success'}
        <ComparePanel assetStoreMap={$compareView.compareAssetMap} />
      {/if}
    </svelte:fragment>
    <div
      slot="content"
      class="h-full grid-cols-[auto_theme(spacing.sidebar)] sm:grid">
      <div
        class="h-full lg:h-screen"
        class:flex={$viewState === 'compare' &&
          $compareView.state === 'success'}
        class:flex-col={$viewState === 'compare' &&
          $compareView.state === 'success'}
        class:justify-center={$viewState === 'compare' &&
          $compareView.state === 'success'}>
        {#if $viewState === 'hierarchy' && $hierarchyView.state === 'success'}
          <TreeView
            assetStoreMap={$hierarchyView.assets}
            selectedAsset={$hierarchyView.selectedAssetStore}
            on:mobileTap={() => (showPanel = true)} />
        {:else if $viewState === 'compare' && $compareView.state === 'success'}
          <CompareView selectedAssets={$compareView.selectedAssets} />
        {/if}
        <button
          class="m-2 bg-blue-600 p-2 text-white sm:hidden"
          on:click={() => (showPanel = !showPanel)}>Reveal</button>
      </div>
      <RevealablePanel {showPanel}>
        {#if $viewState === 'hierarchy' && $hierarchyView.state === 'success'}
          <DetailedInfo
            on:close={() => (showPanel = false)}
            assetData={$hierarchyView.selectedAssetStore} />
        {:else if $viewState === 'compare' && $compareView.state === 'success'}
          {#if $compareView.activeAssetData}
            <CompareDetailedInfo
              on:close={() => (showPanel = false)}
              assetData={$compareView.activeAssetData} />
          {/if}
        {/if}
      </RevealablePanel>
    </div>
    <svelte:fragment slot="back-bar">{$_('page.home.title')}</svelte:fragment>
  </SidebarLayout>
</div>
