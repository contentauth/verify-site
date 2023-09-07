<!--
  ADOBE CONFIDENTIAL
  Copyright 2020 Adobe
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
  import { _ } from 'svelte-i18n';
  import Footer from '../components/Footer/Footer.svelte';
  import Header from '../components/Header/Header.svelte';
  import HeaderLink from '../components/Header/HeaderLink.svelte';
  import Hero  from '../components/Hero/Hero.svelte';
  import Home1 from '$src/components/Homepage/Home1.svelte';
  import Home2 from '$src/components/Homepage/Home2.svelte';
  import Home3 from '$src/components/Homepage/Home3.svelte';
  import Home4 from '$src/components/Homepage/Home4.svelte';
  import Home5 from '$src/components/Homepage/Home5.svelte';
  import Home6 from '$src/components/Homepage/Home6.svelte';
  import Home7 from '$src/components/Homepage/Home7.svelte';
  import NewFooter from '$src/components/Footer/NewFooter.svelte';
</script>

<Header>
  <svelte:fragment slot="links">
    <HeaderLink href="/verify">Verify</HeaderLink>
    <HeaderLink href="/apply">Apply</HeaderLink>
    <HeaderLink href="/">Embed</HeaderLink>
  </svelte:fragment>
</Header>
<div class="flex flex-col items-center justify-center">
  <!-- <h1 class="w-[47.5rem] text-center text-[5rem]/tight font-black">
    {$_('page.home.cta')}
  </h1> -->
  <Hero />
  <Home1 />
  <Home2 />
  <Home3 />
  <Home4 />
  <Home5 />
  <Home6 />
  <Home7 />
</div>
<NewFooter />
<!-- <Footer /> -->
