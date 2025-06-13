<!--
  Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Section from '$src/components/SidebarSection/Section.svelte';
  import BodyBold from '$src/components/typography/BodyBold.svelte';
  import Link from '$src/components/typography/Link.svelte';
  import { _ } from 'svelte-i18n';
</script>

<Section>
  <BodyBold slot="title">{$_('sidebar.verify.advanced')}</BodyBold>
  <Link slot="content">{$_('sidebar.verify.advanced.show')}</Link>
</Section>
