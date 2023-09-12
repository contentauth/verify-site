<!--
  ADOBE CONFIDENTIAL
  Copyright 2022 Adobe
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
  import { _, date as fDate, time } from 'svelte-i18n';

  export let date: Date;
  export let noTime = false;
</script>

<span>
  {#if date.toString() === 'Invalid Date'}
    {$_('comp.date.invalid')}
  {:else if noTime}
    {$fDate(date, { format: 'medium' })}
  {:else}{$fDate(date, { format: 'medium' })}
    <span>{$_('comp.date.at')}</span>
    {$time(date, {
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
    })}
  {/if}
</span>
