<script lang="ts" context="module">
  export interface NavItem {
    label: string;
  }
</script>

<script lang="ts">
  import CloseIcon from '$assets/svg/monochrome/close.svg?component';
  import Body from '$src/components/typography/Body.svelte';
  import { verifyStore } from '../../../stores';

  export let type: string;
  export let rootLabel: string;
  export let title: string;
  export let items: NavItem[] = [];

  const { selectL4Ref } = verifyStore;
</script>

<div class="relative">
  {#if type !== 'manifestStore'}
    <button
      class="absolute right-5 top-3 cursor-pointer"
      on:click={() => {
        selectL4Ref(null);
      }}>
      <span><CloseIcon class="h-5 w-5 text-gray-500" /></span>
    </button>
  {/if}
  <nav
    class=" flex flex-col space-y-1 bg-gray-100 px-5 py-3"
    aria-label="Breadcrumb">
    <ol role="list" class="flex items-center">
      <li>
        <div class="flex items-center">
          <button
            ><Body><span class="font-bold">{rootLabel}</span></Body></button>
          <svg
            class="h-5 w-5 flex-shrink-0 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clip-rule="evenodd" />
          </svg>
        </div>
      </li>
      {#each items as item}
        <li>
          <div class="flex items-center">
            <button><Body>{item.label}</Body></button>
            <svg
              class="h-5 w-5 flex-shrink-0 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clip-rule="evenodd" />
            </svg>
          </div>
        </li>
      {/each}
    </ol>
    <div class="text-subtitle">{title}</div>
  </nav>
</div>
