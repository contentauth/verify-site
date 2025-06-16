<script>
  import Video from '$assets/video/cr-06.mp4';
</script>

<div class="md:grid md:grid-cols-12 md:gap-4 xl:max-w-[1440px]">
  <div class="md:col-span-6">
    <div class="video-container z-998">
      <video
        autoplay
        loop
        muted
        playsinline
        src={Video}
        class="h-full max-h-full w-full max-w-full rounded-xl object-cover lg:rounded-[20px] xl:h-full"
        alt="Animation of a mouse cursor hovering over and clicking
        the Content Credentials pin icon" />
    </div>
  </div>
  <div
    class="pt-6 md:col-start-7 md:col-end-13 md:pt-0 lg:col-start-8 lg:col-end-12">
    <div class="max-w-[676px]">
      <h3 class="pb-6 text-left text-key-title 2xl:text-key-title-xl">
        Introducing the Content Credentials pin
      </h3>
      <p
        class="text-key-sub-text text-brand-gray lg:text-key-sub-text-lg 2xl:text-key-sub-text-xl">
        When you see the Content Credentials pin, it means Content Credentials
        are attached! Simply click the pin to reveal more information about the
        content you’re viewing.
      </p>
    </div>
  </div>
</div>

<style>
  /* CSS to set the aspect ratio for the video container */
  .video-container {
    position: relative;
    padding-bottom: 66.67%; /* 3:2 aspect ratio (2/3) */
    overflow: hidden;
  }

  /* Style the video to fill the container */
  .video-container video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
