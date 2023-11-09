<script lang="ts">
  import { verifyStore } from '../../stores';
  import DataView from './Detail/DataView.svelte';
  import Nav, { type NavItem } from './Detail/Nav.svelte';

  const { selectedL4Node, mostRecentlyLoaded } = verifyStore;
  const rootItem: NavItem = { label: 'Manifest store' };
  const dataViewMap = {
    assertions: (data: any) => {
      return {
        blob: data.data,
        parsed: data.parsed,
        isBinary: data.type === 'binary',
      };
    },
  };
  let navTitle = rootItem.label;
  let navItems: NavItem[] = [];

  $: rootLabel = $mostRecentlyLoaded.assetData?.title;
  $: type = $selectedL4Node?.type;

  $: {
    console.log('$selectedL4Node', $selectedL4Node);
    navItems = [];

    if (type !== 'manifestStore') {
      navItems = [...navItems, rootItem];

      if (type !== 'manifest') {
        navItems = [...navItems, { label: 'Manifest' }];
      }

      switch (type) {
        case 'manifest':
          navTitle = 'Manifest';
          break;
        case 'signature':
          navTitle = 'Claim signature';
          break;
        case 'claim':
          navTitle = 'Claim';
          break;
        case 'assertions':
          navItems = [...navItems, { label: 'Assertions' }];
          navTitle = $selectedL4Node.items[0]?.label;
          break;
      }
    }
  }
</script>

{#if rootLabel}
  <Nav {rootLabel} title={navTitle} items={navItems} />
{/if}

<div class="p-4">
  {#if type === 'assertions'}
    {#each $selectedL4Node.items as assertion}
      <DataView {...dataViewMap.assertions(assertion)} />
    {/each}
  {/if}
</div>
