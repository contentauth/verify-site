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
  import { analytics } from '$src/lib/analytics';
  import { onMount, type SvelteComponent } from 'svelte';
  import { _ } from 'svelte-i18n';
  import CompareDetailedInfo from './components/Compare/CompareInfo/CompareInfo.svelte';
  import ComparePanel from './components/Compare/ComparePanel/ComparePanel.svelte';
  import CompareView from './components/Compare/CompareView/CompareView.svelte';
  import DetailedInfo from './components/DetailedInfo/DetailedInfo.svelte';
  import DragDropOverlay from './components/DragDropOverlay/DragDropOverlay.svelte';
  import EmptyState from './components/EmptyState/EmptyState.svelte';
  import FilePicker from './components/FilePicker/FilePicker.svelte';
  import L4View from './components/L4View/L4View.svelte';
  import LoadingOverlay from './components/LoadingOverlay/LoadingOverlay.svelte';
  import NavigationPanel from './components/NavigationPanel/NavigationPanel.svelte';
  import RevealablePanel from './components/RevealablePanel/RevealablePanel.svelte';
  import TreeView from './components/TreeView/TreeView.svelte';
  import { dragDropAction, type DragDropActionParams } from './lib/dragDrop';
  import { verifyStore } from './stores';

  let showDropOverlay = false;
  let showPanel = false;
  let filePicker: SvelteComponent<{ launch?: () => void }>;
  let rightPanel: SvelteComponent<{
    getElement?: () => HTMLDivElement | undefined;
  }>;
  let isSidebarScrolled = false;
  const { hierarchyView, l4View, compareView, viewState, viewLevel } =
    verifyStore;
  // Number of pixels to scroll for shadow to be shown
  const sidebarScrollThreshold = 10;

  const dragDropParams: DragDropActionParams = {
    onDragStateChange(newState: boolean) {
      showDropOverlay = newState;
    },
  };

  $: hasEmptyState = $hierarchyView.state === 'none';
  $: showLoadingOverlay = $hierarchyView.state === 'loading';
  $: showL4 = $viewLevel === 'L4';

  // Check for `source` parameter and load that asset if it exists
  afterNavigate((nav: import('@sveltejs/kit').AfterNavigate) => {
    const { searchParams } = nav.to?.url ?? {};
    const source = searchParams?.get('source');
    const view = searchParams?.get('view')?.toUpperCase();

    if (!source) return;

    if (view === 'L4') {
      verifyStore.setViewLevel('L4');
    }

    try {
      const sourceUrl = new URL(source);
      verifyStore.readC2paSource(sourceUrl.toString());
    } catch (err) {
      // Invalid source passed, ignore
      return;
    }
  });

  function handleLaunchFilePicker(context: string) {
    return () => {
      filePicker?.launch();
      analytics.track('launchFilePicker', { context });
    };
  }

  function handleSidebarScroll(evt: CustomEvent<{ scrollTop: number }>) {
    isSidebarScrolled = evt.detail.scrollTop > sidebarScrollThreshold;
  }

  onMount(() => {
    // Run cleanup when this component is unmounted (e.g. on navigating away)
    return () => {
      verifyStore.clear();
    };
  });
</script>

<div
  use:dragDropAction={dragDropParams}
  aria-busy={showLoadingOverlay ? 'true' : 'false'}
  data-testid="file-dropzone">
  <DragDropOverlay visible={showDropOverlay} />
  <LoadingOverlay visible={showLoadingOverlay} />
  <FilePicker bind:this={filePicker} />
  <SidebarLayout
    leftColumnTakeover={hasEmptyState}
    wide={showL4}
    on:sidebarScroll={handleSidebarScroll}
    showHeader={$viewState !== 'compare'}>
    <!-- Left panel -->
    <svelte:fragment slot="sidebar">
      {#if $viewState === 'hierarchy'}
        {#if hasEmptyState}
          <EmptyState
            on:launchFilePicker={handleLaunchFilePicker('emptyState')} />
        {:else}
          <NavigationPanel
            on:launchFilePicker={handleLaunchFilePicker('leftPanel')}
            isScrolled={isSidebarScrolled}
            hideManifestRecovery={showL4} />
        {/if}
      {:else if $viewState === 'compare' && $compareView.state === 'success'}
        <ComparePanel assetStoreMap={$compareView.compareAssetMap} />
      {/if}
    </svelte:fragment>
    <!-- Content (main 2/3rds) -->
    <svelte:fragment slot="content">
      {#if showL4 && $l4View.tree}
        <div class="h-full w-full bg-gray-40">
          <L4View tree={$l4View.tree} />
        </div>
      {:else}
        <div
          class="h-full grid-cols-[auto_theme(spacing.sidebar)] bg-gray-40 sm:grid">
          <!-- Center panel -->
          <div class="h-full lg:h-screen">
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
          <!-- Right panel -->
          <RevealablePanel {showPanel} bind:this={rightPanel}>
            {#if $viewState === 'hierarchy' && $hierarchyView.state === 'success' && $hierarchyView.selectedAssetStore}
              <DetailedInfo
                on:close={() => (showPanel = false)}
                assetData={$hierarchyView.selectedAssetStore}
                viewportElement={rightPanel?.getElement()} />
            {:else if $viewState === 'compare' && $compareView.state === 'success'}
              {#if $compareView.activeAssetData}
                <CompareDetailedInfo
                  on:close={() => (showPanel = false)}
                  assetData={$compareView.activeAssetData} />
              {/if}
            {/if}
          </RevealablePanel>
        </div>
      {/if}
    </svelte:fragment>
    <svelte:fragment slot="back-bar">{$_('page.home.title')}</svelte:fragment>
  </SidebarLayout>
</div>
