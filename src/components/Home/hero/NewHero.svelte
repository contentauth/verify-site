<script>
  import Video from '$assets/video/penguins.mp4';
</script>

<div class="flex w-screen max-w-[90rem] items-center justify-center">
  <div
    class="flex h-full w-full flex-col items-center justify-between gap-[1.25rem] self-stretch p-[20px] pt-[40px] sm:p-[2rem] sm:pt-[40px] md:flex-row lg:gap-[1.5rem] 2xl:col-span-12">
    <div
      class="flex h-full w-full items-center justify-center md:w-1/2 2xl:col-start-1 2xl:col-end-6">
      <div
        class="flex max-w-[41rem] flex-col items-start justify-center self-stretch p-0 xl:max-w-[41rem]">
        <h1
          class="pb-[2rem] text-center font-base text-hero-title tracking-[-0.105rem] lg:text-hero-title-lg xl:text-center 2xl:text-hero-title-desktop">
          Wait, where did this image come from?
        </h1>
        <p
          class="text-center text-hero-sub text-gray-900/60 lg:text-hero-sub-tablet 2xl:text-hero-sub-desktop">
          Deepfakes. Voice cloning. Synthetic media. It’s hard to tell what’s
          accurate and authentic these days.
        </p>
      </div>
    </div>
    <div
      class="flex h-full w-full flex-col items-start justify-center md:w-1/2 md:items-center lg:items-start">
      <div class="flex flex-col items-start">
        <div class="group relative">
          <div
            class="h-full max-h-full w-full max-w-full rounded-xl md:max-w-[704px] lg:rounded-[20px] xl:h-full">
            <video
              autoplay
              loop
              muted
              playsinline
              src={Video}
              class="h-full max-h-full w-full max-w-full rounded-xl md:max-w-[704px] lg:rounded-[20px] xl:h-full"
              alt="Penguins in a desert with sand dunes in the background." />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
