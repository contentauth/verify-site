<!--
  ADOBE CONFIDENTIAL
  Copyright 2023 Adobe
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
  import Section from '$src/components/SidebarSection/Section.svelte';
  import BigThumbnail from './BigThumbnail.svelte';

  export let thumbnail: string | null;
  export let mimeType: string;
</script>

<div class="flex justify-center">
  <Section>
    <BigThumbnail on:click slot="content" {thumbnail} {mimeType} />
  </Section>
</div>
