<script>
  // import { _ } from 'svelte-i18n';
  import PolarBear from '../../../../assets/png/polarbear.png';
</script>

<div class="h-[screen - 100px] flex w-screen items-center justify-center">
  <div
    class="flex h-full w-full flex-col items-center justify-between gap-[1.25rem] self-stretch p-[2.25rem] md:p-[2.5rem]
    lg:flex-row lg:gap-[1.5rem]">
    <div
      class="flex h-full w-full items-center justify-center lg:w-1/2
    ">
      <div
        class="lg:max-w[25rem] flex w-[670px] max-w-[41rem] flex-col items-center justify-center p-[1.5rem]
        self-stretch xl:max-w-[41rem]">
        <div
          class=" text-hero-title pb-6 text-center tracking-[-0.105rem] 2xl:text-hero-title-desktop">
          Wait, where did this image come from?
        </div>
        <div
          class="text-hero-sub text-brand-gray text-center 2xl:text-hero-sub-desktop 2xl:w-[40rem]">
          Deepfakes. Voice Cloning. It's hard to tell what's accurate and
          authentic online these days.
        </div>
      </div>
    </div>
    <div
      class="flex h-full w-full flex-col items-start justify-center lg:w-1/2">
      <img
        src={PolarBear}
        alt="hi"
        class="w-[full - 20px] h-[full - 20px] rounded-xl" />
      <div class="pt-1 text-small-description text-gray-500">
        Click on the pin to see the Content Credentials.
      </div>
    </div>
  </div>
</div>
