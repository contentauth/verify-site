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
  import Footer from '../components/Footer/Footer.svelte';
  import Header from '../components/Home/header/Header.svelte';
  import Hero from '$src/components/Home/hero/NewHero.svelte';
  import Home1 from '$src/components/Home/homepage/Home1.svelte';
  import HowItWorks from '$src/components/Home/homepage/HowItWorks.svelte';
  import Movement from '$src/components/Home/homepage/Movement.svelte';
  import Orgs from '$src/components/Home/homepage/Orgs.svelte';
  import Trust from '$src/components/Home/homepage/Trust.svelte';
  import Powered from '$src/components/Home/homepage/Powered.svelte';
</script>

<svelte:head>
  <title>Content Credentials</title>
  <meta
    name="description"
    content="Introducing the new standard for content authentication. Content Credentials provide deeper transparency into how content was created or edited." />
  <meta
    property="og:title"
    content="Reveal Where That Content Came From | Content Credentials" />
  <meta
    property="og:description"
    content="Introducing the new standard for content authentication. Content Credentials provide deeper transparency into how content was created or edited." />
  <meta
    property="og:image"
    content="https://www.contentcredentials.org/static/opengraph.png" />
  <meta property="og:url" content="https://www.contentcredentials.org/" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ContentCreds" />
  <meta name="twitter:creator" content="@ContentCreds" />
  <meta
    name="twitter:title"
    content="Reveal Where That Content Came From | Content Credentials" />
  <meta
    name="twitter:description"
    content="Introducing the new standard for content authentication. Content Credentials provide deeper transparency into how content was created or edited." />
  <meta
    name="twitter:image"
    content="https://www.contentcredentials.org/static/opengraph.png" />
  <meta name="twitter:image:alt" content="Content Credentials" />

  <meta
    name="linkedin:title"
    content="Reveal Where That Content Came From | Content Credentials" />
  <meta
    name="linkedin:description"
    content="Introducing the new standard for content authentication. Content Credentials provide deeper transparency into how content was created or edited." />
  <meta
    name="linkedin:image"
    content="https://www.contentcredentials.org/static/opengraph.png" />
  <meta name="linkedin:image:alt" content="Content Credentials" />
</svelte:head>


<div class="overflow-x-hidden">
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
