<script>
  import Image from '$assets/jpg/home2.jpg';
  import L2Overlay from '../L2Overlay/L2Overlay.svelte';
</script>

<div class="md:grid md:grid-cols-12 md:gap-4 xl:max-w-[1440px]">
  <!-- Mobile -->
  <div class="md:col-span-6 md:col-start-7 md:hidden">
    <L2Overlay
      imageUrl={Image}
      class="w-full"
      alt="Two people standing next to each other in front of a black background with their arms crossed, wearing ornate and colorful flower headdresses. " />
  </div>
  <div
    class="pt-6 md:col-start-2 md:col-end-6 md:pt-0 xl:col-start-2 xl:col-end-6">
    <div class="max-w-[676px]">
      <h3 class="pb-6 text-left text-key-title 2xl:text-key-title-xl">
        Empowering creators to get credit for their work
      </h3>
      <p
        class="text-key-sub-text text-gray-900/60 xl:text-key-sub-text-xl 2xl:text-key-sub-text-2xl">
        Content is often miscredited or not credited at all when shared online,
        creating tons of lost opportunity for creators. Content Credentials
        enable creators to get recognized for their work, market it, and build
        their following.
      </p>
    </div>
  </div>
  <!-- Below hidden until Desktop -->
  <div class="hidden w-full md:col-span-6 md:col-start-7 md:flex">
    <L2Overlay
      imageUrl={Image}
      class="w-full"
      alt="Two people standing next to each other in front of a black background with their arms crossed, wearing ornate and colorful flower headdresses." />
  </div>
</div>
