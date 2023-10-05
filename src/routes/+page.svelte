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
  // import { _ } from 'svelte-i18n';
  import Footer from '../components/Footer/Footer.svelte';
  // import Header from './components/header/Header.svelte';
  import Header from '../components/Home/header/Header.svelte';
  // import HeaderLink from '../components/Header/HeaderLink.svelte';
  import Hero from '$src/components/Home/hero/NewHero.svelte';
  import Home1 from '$src/components/Home/homepage/Home1.svelte';
  import HowItWorks from '$src/components/Home/homepage/HowItWorks.svelte';
  import Trust from '$src/components/Home/homepage/Trust.svelte';
  import Movement from '$src/components/Home/homepage/Movement.svelte';
  import Orgs from '$src/components/Home/homepage/Orgs.svelte';
  import Powered from '$src/components/Home/homepage/Powered.svelte';
  import { MetaTags } from 'svelte-meta-tags';
  import OG from '$src/assets/images/opengraph.png';
</script>

<MetaTags
  title="Content Credentials"
  description="Introducing the new standard for content authentication. Content Credentials provide deeper transparency into how content was created or edited."
  canonical="https://www.contentcredentials.org/"
  openGraph={{
    url: 'https://www.contentcredentials.org/',
    title: 'Verify The Authenticity of Online Content | Content Credentials',
    description:
      'Meet the Content Credentials pin, an all-new way to tag images, videos and other digital content with complete details on who created it and how.',
    images: [
      {
        url: 'https://www.contentcredentials.org/open-graph.png',
        width: 800,
        height: 600,
        alt: 'Content Credentials',
      },
    ],
    siteName: 'Content Credentials',
  }}
  twitter={{
    handle: '@contentcreds',
    site: '@contentcreds',
    cardType: 'summary_large_image',
    title: 'Verify The Authenticity of Online Content | Content Credentials',
    description:
      'Meet the Content Credentials pin, an all-new way to tag images, videos and other digital content with complete details on who created it and how.',
    image: OG,
    imageAlt: 'Content Credentials',
  }}
  facebook={{
    appId: '1234567890',
  }} />

<!-- <Header>
  <svelte:fragment slot="links">
    <HeaderLink href="/verify">Verify</HeaderLink>
    <HeaderLink href="/apply">Apply</HeaderLink>
    <HeaderLink href="/">Embed</HeaderLink>
  </svelte:fragment>
</Header> -->
<div class="overflow-x-hidden font-base">
  <Header />
  <div class="flex flex-col items-center justify-center">
    <Hero />
    <Home1 />
    <HowItWorks />
    <Trust />
    <Powered />
    <Orgs />
    <Movement />
  </div>
  <Footer />
</div>
