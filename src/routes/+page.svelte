<!--
 Copyright 2021-2024 Adobe, Copyright 2025 The C2PA Contributors
-->
<script lang="ts">
  import Hero from '$src/components/Home/hero/NewHero.svelte';
  import Home1 from '$src/components/Home/homepage/Home1.svelte';
  import HowItWorks from '$src/components/Home/homepage/HowItWorks.svelte';
  import Movement from '$src/components/Home/homepage/Movement.svelte';
  import Orgs from '$src/components/Home/homepage/Orgs.svelte';
  import Powered from '$src/components/Home/homepage/Powered.svelte';
  import Trust from '$src/components/Home/homepage/Trust.svelte';
  import Footer from '../components/Footer/Footer.svelte';
  import Header from '../components/Home/header/Header.svelte';
</script>

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
