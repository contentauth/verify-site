<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Description from '$src/components/typography/Description.svelte';
  import type { ManifestData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';
  import AssetInfoDate from './AssetInfoDate.svelte';

  export let manifestData: ManifestData | null;
  export let trustSource: 'official' | 'legacy' | 'none' = 'none';
  $: date = manifestData?.date;
  $: issuer = manifestData?.signatureInfo?.issuer;
</script>

<Description>{#if issuer}<span class="{trustSource !== 'none' ? 'ml-1.5' : ''}">{$_('sidebar.verify.about.issuedby')} {issuer}</span>{/if}{#if trustSource === 'legacy'}<span class="bg-[#fef3c7] text-[#92400e] px-1 rounded-sm font-medium {issuer ? 'ml-1' : ''}">Legacy trust</span>{:else if trustSource === 'official'}<span class="bg-[#374151] text-white px-1 rounded-sm font-medium {issuer ? 'ml-1' : ''}">Conformant</span>{:else if date}{$_('sidebar.verify.asset.date.on')} <AssetInfoDate {date} />{/if}</Description>
