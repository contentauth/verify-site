<script>
  import Image from '$assets/jpg/butteryfly.jpg';
  import L2Overlay from '../L2Overlay/L2Overlay.svelte';
</script>

<div class="w-full md:grid md:grid-cols-12 md:gap-4 xl:max-w-[1440px]">
  <div class="w-full md:col-span-6">
    <L2Overlay
      imageUrl={Image}
      class="w-full"
      alt="Two women looking at a mobile phone, smiling and
    pointing at it with a clear sky behind them." />
  </div>
  <div
    class="pt-6 md:col-start-7 md:col-end-13 md:pt-0 lg:col-start-8 lg:col-end-12">
    <div class="max-w-[676px] md:mx-0">
      <h3 class="2xl:text-key-title-xl pb-6 text-left text-key-title">
        Building trust in what you see online
      </h3>
      <p
        class="2xl:text-key-sub-text-2xl text-key-sub-text text-gray-900/60 xl:text-key-sub-text-xl">
        Content Credentials make the origin and history of content available for
        everyone to access, anytime. With this information at your fingertips,
        you have the ability to decide if you trust the content you
        see—understanding what it is and how much editing or manipulation it
        went through.
      </p>
    </div>
  </div>
</div>
