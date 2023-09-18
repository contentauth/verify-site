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
  // import Header from './components/header/Header.svelte';
  import Header from './components/header/Header.svelte';
  import HeaderLink from '../components/Header/HeaderLink.svelte';
  import Hero from './components/Hero/Hero.svelte';
  import NewFooter from '$src/components/Footer/NewFooter.svelte';
  import Home1 from './components/homepage/home1.svelte';
  import Home2 from './components/homepage/home2.svelte';
  import Home3 from './components/homepage/home3.svelte';
  import Home4 from './components/homepage/home4.svelte';
  import HowItWorks from './components/homepage/HowItWorks.svelte';
  import Trust from './components/homepage/Trust.svelte';
  import Movement from './components/homepage/Movement.svelte';
</script>

<!-- <Header>
  <svelte:fragment slot="links">
    <HeaderLink href="/verify">Verify</HeaderLink>
    <HeaderLink href="/apply">Apply</HeaderLink>
    <HeaderLink href="/">Embed</HeaderLink>
  </svelte:fragment>
</Header> -->
<Header />
<div class="flex flex-col items-center justify-center">
  <Hero />
  <Home1 />
  <Home2 />
  <Home3 />
  <Home4 />
  <HowItWorks />
  <Trust />
  <Movement />
</div>
<NewFooter />
