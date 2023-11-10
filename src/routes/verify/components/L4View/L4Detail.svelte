<script lang="ts">
  import Link from '$src/components/typography/Link.svelte';
  import { pick } from 'lodash';
  import { verifyStore } from '../../stores';
  import DataView from './Detail/DataView.svelte';
  import Nav, { type NavItem } from './Detail/Nav.svelte';

  const { selectedL4Node, mostRecentlyLoaded, selectL4Ref } = verifyStore;
  const rootItem: NavItem = { label: 'Manifest store' };
  const dataViewMap: Record<string, (data: any) => any> = {
    assertion: (data: any) => {
      return {
        type: 'assertion',
        blob: data.assertion.data,
        parsed: data.assertion.parsed,
        isBinary: data.assertion.type === 'binary',
      };
    },
    claim: (data: any) => {
      return {
        type: 'claim',
        parsed: data.data,
      };
    },
    manifest: (data: any) => {
      return {
        type: 'manifest',
        customFields: {
          uri: data.manifest.data.uri,
          isActive: data.manifest.data.isActive,
        },
      };
    },
    signature: (data: any) => {
      return {
        type: 'signature',
        customFields: {
          info: pick(data, ['alg', 'cert_serial_number', 'date', 'issuer_org']),
          details: data.cert_details,
        },
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
        case 'assertion':
          navItems = [...navItems, { label: 'Assertions' }];
          navTitle = $selectedL4Node.assertion?.label;
          break;
      }
    } else {
      navTitle = 'Manifest store';
    }
  }
</script>

{#if rootLabel}
  <Nav {rootLabel} {type} title={navTitle} items={navItems} />
{/if}

{#key $selectedL4Node}
  <div class="px-5 pt-2">
    {#if type && dataViewMap[type]}
      <DataView {...dataViewMap[type]($selectedL4Node)} />
    {:else if type === 'manifestStore'}
      <div class="pt-2 text-body">
        <div>
          <strong>{rootLabel}</strong> has {$selectedL4Node.hierarchy.nodes
            .length} manifests:
        </div>
        <ol class="list-inside list-disc space-y-0.5 pt-2">
          {#each $selectedL4Node.hierarchy.nodes as node}
            <li>
              <button on:click={() => selectL4Ref(node.data.ref)}
                ><Link>{node.data.uri}</Link></button>
            </li>
          {/each}
        </ol>
      </div>
    {/if}
  </div>
{/key}
