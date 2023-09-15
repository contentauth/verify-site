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
  <Header burgerOpen={true} />
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
