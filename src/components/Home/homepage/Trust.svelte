<script>
  import TrustCards from './TrustCards.svelte';
  import TrustCardsDesktop from './TrustCardsDesktop.svelte';
</script>

<div
  class="space-y-0 flex w-screen max-w-[90rem] items-center justify-center px-[1.5rem] lg:mt-20 lg:mb-[5.5rem] xl:mt-40 xl:mb-48">
  <div
    class="flex flex-col items-center justify-center gap-[64px] md:gap-[80px]">
    <h2
      class=" 2xl:w-[58rem] 2xl:text-trust-title-2xl w-[22rem] pt-20 text-center text-trust-title md:w-[40rem] md:text-trust-title-md xl:py-0 xl:text-trust-title-xl">
      What makes Content Credentials trustworthy
    </h2>
    <div class="flex xl:hidden"><TrustCards /></div>
    <div class="hidden xl:flex"><TrustCardsDesktop /></div>
  </div>
</div>
