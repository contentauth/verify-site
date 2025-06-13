<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import { _, date as formatDate, time } from 'svelte-i18n';

  export let date: Date;
  export let noTime = false;
</script>

<span>
  {#if date.toString() === 'Invalid Date'}
    {$_('comp.date.invalid')}
  {:else if noTime}
    {$formatDate(date, { format: 'medium' })}
  {:else}{$formatDate(date, { format: 'medium' })}
    <span>{$_('comp.date.at')}</span>
    {$time(date, {
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    })}
  {/if}
</span>
