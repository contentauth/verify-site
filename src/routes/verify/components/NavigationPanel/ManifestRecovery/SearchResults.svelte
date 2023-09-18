<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { ReadableRecoveredManifestStore } from '../../../stores/recoveredManifest';
  import ManifestRecoveryItem from './ManifestRecoveryItem.svelte';

  export let results: ReadableRecoveredManifestStore[];
</script>

<div>
  {#if results.length > 0}
    {#each results as result}
      <ManifestRecoveryItem recoveredManifestStore={result} />
    {/each}
  {:else}
    {$_('sidebar.verify.recovery.noMatches')}
  {/if}
</div>
