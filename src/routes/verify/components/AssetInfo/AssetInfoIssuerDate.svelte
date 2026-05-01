<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Description from '$src/components/typography/Description.svelte';
  import type { ManifestData } from '$src/lib/asset';
  import { _ } from 'svelte-i18n';

  export let manifestData: ManifestData | null;
  export const trustSource: 'official' | 'legacy' | 'none' = 'none';
  $: issuer = manifestData?.signatureInfo?.issuer;
</script>

<Description
  >{#if issuer}{$_('sidebar.verify.about.issuedby')} {issuer}{/if}</Description>
