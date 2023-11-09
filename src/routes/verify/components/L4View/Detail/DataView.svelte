<script lang="ts" context="module">
  export interface TabItem {
    id: string;
    label: string;
  }
</script>

<script lang="ts">
  import TreeView, { type ValueComponent } from 'svelte-tree-view';
  import Preview from './Preview.svelte';
  import TreeNodeFormatter from './TreeNodeFormatter.svelte';

  const valueComponent = TreeNodeFormatter as unknown as ValueComponent<any>;
  export let blob: Blob | null = null;
  export let parsed: Record<string, any> | null = null;
  export let isBinary = false;

  let availableTabs: TabItem[] = [];
  let selectedIndex = 0;
  let treeExpanded = false;

  const tabs: TabItem[] = [
    {
      id: 'preview',
      label: 'Preview',
    },
    {
      id: 'tree',
      label: 'Tree',
    },
    {
      id: 'data',
      label: 'Data',
    },
    {
      id: 'hex',
      label: 'Hex',
    },
  ];

  $: selectedTab = availableTabs[selectedIndex]?.id ?? 0;
  $: {
    let toPick: string[] = [];

    if (parsed) {
      toPick.push('tree', 'data');
    }

    if (isBinary) {
      toPick.push('preview');
    }

    availableTabs = tabs.filter((x) => toPick.includes(x.id));
  }
</script>

<nav class="mb-2 flex space-x-4" aria-label="Tabs">
  {#each availableTabs as tab, index}
    <button
      on:click={() => (selectedIndex = index)}
      class="rounded-md px-3 py-2 font-medium transition-colors hover:text-gray-700"
      class:text-gray-700={index !== selectedIndex}
      class:text-blue-900={index === selectedIndex}
      class:bg-blue-100={index === selectedIndex}>{tab.label}</button>
  {/each}
</nav>
<div class="overflow-x-auto rounded border border-gray-100 bg-gray-40 p-4">
  {#if selectedTab === 'preview' && blob}
    {#key blob}
      <Preview {blob} />
    {/key}
  {:else if selectedTab === 'tree'}
    <div class="mb-3 flex justify-start space-x-4">
      <button
        on:click={() => (treeExpanded = true)}
        class="rounded-full bg-white px-2.5 py-0.5 text-informational text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >Expand all</button>
      <button
        on:click={() => (treeExpanded = false)}
        class="rounded-full bg-white px-2.5 py-0.5 text-informational text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >Collapse all</button>
    </div>
    {#key treeExpanded}
      <TreeView
        data={parsed}
        {valueComponent}
        recursionOpts={{ shouldExpandNode: () => treeExpanded }} />
    {/key}
  {/if}
</div>

<style>
  :global(ul.svelte-tree-view) {
    --tree-view-font-family: var(--family-mono);
    --tree-view-font-size: 0.875rem;
    --tree-view-line-height: 1.1rem;

    --tree-view-base00: transparent;
    --tree-view-base01: #604d49;
    --tree-view-base02: #6d5a55;
    --tree-view-base03: var(--gray-300);
    --tree-view-base04: #b79f8d;
    --tree-view-base05: #f9f8f2;
    --tree-view-base06: #f7f4f1;
    --tree-view-base07: #faf8f5;
    --tree-view-base08: #fa3e7e;
    --tree-view-base09: var(--brand-green-1200);
    --tree-view-base0A: #f6bf81;
    --tree-view-base0B: var(--brand-red-1200);
    --tree-view-base0C: #b4efe4;
    --tree-view-base0D: var(--blue-900);
    --tree-view-base0E: #be87ff;
    --tree-view-base0F: #ffcc00;
  }
</style>
