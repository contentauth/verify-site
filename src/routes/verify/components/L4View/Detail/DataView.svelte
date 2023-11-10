<script lang="ts" context="module">
  export interface TabItem {
    id: string;
    label: string;
  }
</script>

<script lang="ts">
  import FormattedDateTime from '$src/components/FormattedDateTime/FormattedDateTime.svelte';
  import TreeView, { type ValueComponent } from 'svelte-tree-view';
  import AboutSectionIconContentRow from '../../DetailedInfo/AboutSection/AboutSectionIconContentRow.svelte';
  import SubSection from '../../SubSection/SubSection.svelte';
  import Preview from './Preview.svelte';
  import TextEditor from './TextEditor.svelte';
  import TreeNodeFormatter from './TreeNodeFormatter.svelte';

  const valueComponent = TreeNodeFormatter as unknown as ValueComponent<any>;
  export let type: string;
  export let blob: Blob | null = null;
  export let parsed: Record<string, any> | null = null;
  export let customFields: Record<string, any> = {};
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
      id: 'manifestInfo',
      label: 'Info',
    },
    {
      id: 'certificateInfo',
      label: 'Info',
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
      id: 'certificateDetails',
      label: 'Certificate details',
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

    if (type === 'manifest') {
      toPick.push('manifestInfo');
    }

    if (type === 'signature') {
      toPick.push('certificateInfo', 'certificateDetails');
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
<div class="mb-4 overflow-x-auto rounded border border-gray-100 bg-gray-40">
  {#if selectedTab === 'preview' && blob}
    <div class="p-4">
      <Preview {blob} />
    </div>
  {:else if selectedTab === 'tree'}
    <div class="p-4">
      <div class="mb-3 flex justify-start space-x-4">
        <button
          on:click={() => (treeExpanded = true)}
          class="rounded-full bg-white px-2.5 py-0.5 text-[0.75rem] text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >Expand all</button>
        <button
          on:click={() => (treeExpanded = false)}
          class="rounded-full bg-white px-2.5 py-0.5 text-[0.75rem] text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >Collapse all</button>
      </div>
      {#key treeExpanded}
        <TreeView
          data={parsed}
          {valueComponent}
          recursionOpts={{
            shouldExpandNode: (node) => treeExpanded,
            mapChildren(value, type, parent) {
              switch (type) {
                case 'array':
                  if (parent.key === 'hash') {
                    return [];
                  }

                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  return value.map((v, i) => [i.toString(), v]);
                case 'map':
                  // eslint-disable-next-line no-case-declarations
                  const entries = Array.from(value.entries());

                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  return entries.map(([key, value], i) => [
                    `[map entry ${i}]`,
                    {
                      '[key]': key,
                      '[value]': value,
                    },
                  ]);
                case 'set':
                  return Array.from(value.values()).map((v, i) => [
                    `[set entry ${i}]`,
                    v,
                  ]);

                case 'object':
                  if (
                    (parent.key === 'hash' || parent.key === 'pad') &&
                    value instanceof Uint8Array
                  ) {
                    return [];
                  } else {
                    return Object.entries(value);
                  }

                default:
                  return [];
              }
            },
          }} />
      {/key}
    </div>
  {:else if selectedTab === 'data'}
    <div class="p-0.5">
      <TextEditor syntax="json" contents={JSON.stringify(parsed, null, 2)} />
    </div>
  {:else if selectedTab === 'manifestInfo'}
    <div class="px-4 pb-4">
      <SubSection
        ><svelte:fragment slot="title">JUMBF URI</svelte:fragment>
        <AboutSectionIconContentRow slot="content">
          <div slot="content">{customFields.uri}</div>
        </AboutSectionIconContentRow>
      </SubSection>
      <SubSection
        ><svelte:fragment slot="title">Active manifest?</svelte:fragment>
        <AboutSectionIconContentRow slot="content">
          <div slot="content">
            {customFields.isActive ? 'Yes' : 'No'}
          </div>
        </AboutSectionIconContentRow>
      </SubSection>
    </div>
  {:else if selectedTab === 'certificateInfo'}
    <div class="px-4 pb-4">
      <SubSection
        ><svelte:fragment slot="title">Issuer</svelte:fragment>
        <AboutSectionIconContentRow slot="content">
          <div slot="content">{customFields.info.issuer_org}</div>
        </AboutSectionIconContentRow>
      </SubSection>
      <SubSection
        ><svelte:fragment slot="title">Date</svelte:fragment>
        <AboutSectionIconContentRow slot="content">
          <div slot="content">
            <FormattedDateTime date={new Date(customFields.info.date)} />
          </div>
        </AboutSectionIconContentRow>
      </SubSection>
      <SubSection
        ><svelte:fragment slot="title">Algorithm</svelte:fragment>
        <AboutSectionIconContentRow slot="content">
          <div slot="content">{customFields.info.alg.toUpperCase()}</div>
        </AboutSectionIconContentRow>
      </SubSection>
      <SubSection
        ><svelte:fragment slot="title"
          >Certificate serial number</svelte:fragment>
        <AboutSectionIconContentRow slot="content">
          <div slot="content">{customFields.info.cert_serial_number}</div>
        </AboutSectionIconContentRow>
      </SubSection>
    </div>
  {:else if selectedTab === 'certificateDetails'}
    <div class="p-0.5">
      <TextEditor contents={customFields.details.join('\n')} />
    </div>
  {/if}
</div>

<style>
  :global(ul.svelte-tree-view) {
    --tree-view-font-family: var(--family-mono);
    --tree-view-font-size: 0.8125rem;
    --tree-view-line-height: 1.1rem;

    --tree-view-base00: transparent;
    --tree-view-base01: #604d49;
    --tree-view-base02: #6d5a55;
    --tree-view-base03: var(--gray-200);
    --tree-view-base04: #b79f8d;
    --tree-view-base05: #f9f8f2;
    --tree-view-base06: #f7f4f1;
    --tree-view-base07: #faf8f5;
    --tree-view-base08: #fa3e7e;
    --tree-view-base09: var(--brand-orange-1200);
    --tree-view-base0A: #f6bf81;
    --tree-view-base0B: var(--brand-red-1200);
    --tree-view-base0C: #b4efe4;
    --tree-view-base0D: var(--brand-green-1400);
    --tree-view-base0E: #be87ff;
    --tree-view-base0F: #ffcc00;
  }
</style>
