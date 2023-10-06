<script>
  import KeyPoints from './KeyPoints.svelte';

  function scrollToHowItWorks() {
    const element = document.getElementById('how-it-works');

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<div
  class="flex w-screen max-w-[90rem] flex-col items-center justify-evenly gap-6 px-[20px] sm:px-[1.5rem] pt-[1.5rem]">
  <div
    class="2xl:w-[910px] flex flex-col items-center justify-center pb-10 pt-20 xl:w-[802px]">
    <h2
      class="2xl:text-home-title-2xl text-center text-home-secondary-title md:text-home-title-md xl:text-hero-title">
      Content Credentials reveal helpful information that's usually hidden
    </h2>
    <div class="flex flex-col items-center justify-center pt-10">
      <p
        class="2xl:text-home-sub-2xl text-center text-home-sub text-gray-900/60 xl:text-home-sub-XL">
        Critical information about the content you see online is often
        inaccessible or inaccurate. Content Credentials are a new open
        technology for revealing answers to your questions about content with a
        simple click: How was it made? Is it AI-generated? When was it created
        or edited?
      </p>
      <button
        on:click={scrollToHowItWorks}
        class="mt-10 flex h-[2.75rem] items-center scroll-smooth rounded-full bg-brand-red px-[1.25rem] py-3 hover:cursor-pointer hover:brightness-[0.9] focus:border-solid focus:border-[1px] focus:border-gray-900">
        See how it works
      </button>
    </div>
  </div>
  <KeyPoints />
</div>
