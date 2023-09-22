<script>
  import KeyPoints from './KeyPoints.svelte';
</script>

<div
  class="w-screen flex flex-col items-center justify-evenly py-[4rem] px-[1.5rem] gap-6">
  <div
    class="h-[468px] flex flex-col items-center justify-center py-[2rem] xl:h-screen xl:w-[802px] 2xl:w-[910px]">
    <div
      class="text-home-secondary-title text-center md:text-home-title-md xl:text-home-title-xl 2xl:text-home-title-2xl">
      Content Credentials reveals helpful information that's usually hidden
    </div>
    <div class="pt-10 flex flex-col items-center justify-center">
      <div
        class="text-home-sub text-brand-gray text-center xl:text-home-sub-XL 2xl:text-home-sub-2xl">
        Important information about the content you see is invisible to most
        users of the internet. Content Credentials is a new open-source tool
        that exposes answers to all the questions you have about content—like if
        it was made with AI or not, who made it and when, and how it was
        made—with a simple click.
      </div>
      <a href="/" class="bg-brand-blue rounded-full px-3 py-3 mt-10"
        >See how it works</a>
    </div>
  </div>
  <KeyPoints />
</div>
