<script>
  import { _ } from 'svelte-i18n';
  import PolarBear from '../../../../assets/png/polarbear.png';

 
</script>

<div class="h-[screen - 100px] flex w-screen items-center justify-center">
  <div
    class="flex h-full w-full flex-row items-center justify-center p-6 ">
    <div class="flex h-full w-[50%] items-center justify-center">
      <div class="flex w-[575px] flex-col items-center justify-center">
        <div class="pb-6 text-center text-heroNew">
          Wait, where did this image come from?
        </div>
        <div class="text-subheading text-center text-sub-heading">
          Deepfakes. Voice Cloning. It's hard to tell what's accurate and
          authentic online these days.
        </div>
      </div>
    </div>
    <div class="flex h-full w-[50%] flex-col items-start justify-center">
      <img
        src={PolarBear}
        alt="hi"
        class="w-[full - 20px] h-[full - 20px] rounded-xl" />
      <div class="text-small-description text-gray-500">
        Click on the pin to see the Content Credentials.
      </div>
    </div>
  </div>
</div>
