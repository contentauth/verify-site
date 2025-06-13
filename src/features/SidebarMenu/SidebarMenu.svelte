<!--
Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Header from '$src/components/Header/Header.svelte';
  import { _ } from 'svelte-i18n';
  import MenuItem from './SidebarMenuItem.svelte';
  import MenuSection from './SidebarMenuSection.svelte';
  import { sidebarMenuState } from './store/sidebarMenuState';
</script>

<div
  class="fixed top-0 h-screen w-sidebar border-e-2 bg-white transition"
  class:-translate-x-full={!$sidebarMenuState}
  class:shadow={$sidebarMenuState}>
  <Header />
  <div class="border-t-2 py-4">
    <MenuItem href="/">{$_('menu.home')}</MenuItem>
    <MenuItem href="/verify">
      {$_('menu.section.features.verify')}
    </MenuItem>
    <MenuSection title={$_('menu.section.getInvolved')}>
      <MenuItem href="https://contentauthenticity.org/" target="_blank">
        {$_('menu.section.getInvolved.CAI')}
      </MenuItem>
      <MenuItem
        href="https://opensource.contentauthenticity.org/"
        target="_blank">
        {$_('menu.section.getInvolved.OSS')}
      </MenuItem>
      <MenuItem href="https://discord.gg/CAI" target="_blank">
        {$_('menu.section.getInvolved.discord')}
      </MenuItem>
      <MenuItem href="https://github.com/contentauth" target="_blank">
        {$_('menu.section.getInvolved.github')}
      </MenuItem>
    </MenuSection>
  </div>
</div>
