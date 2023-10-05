<script>
  import Hiw1 from '$assets/png/hiw1.png';
  import Hiw2 from '$assets/png/hiw2.png';
  import Video from '$assets/video/howitworks.mp4';
</script>

<div
  class="flex h-full w-screen flex-col items-center bg-[#f5f5f5] px-[20px] sm:px-[1.5rem] pb-40 pt-[4rem] md:pt-[6rem] lg:pt-[8rem] xl:pt-[10rem]"
  id="how-it-works">
  <h2
    class="2xl:text-hiw-title-2xl mb-[64px] sm:mb-[80px] text-hiw-title md:text-hiw-title-md xl:text-hiw-title-xl">
    How it Works
  </h2>
  <div class="2xl:hidden flex w-full flex-col items-center">
    <div class="">
      <div
        class="2xl:pt-[160px] max-w-[90rem] lg:max-w-[1145px] xl:max-w-[116rem] xl:px-[10rem] xl:pt-[128px]">
        <div
          class="flex max-w-[86rem] flex-col md:flex-row items-start justify-between xl:pb-[4rem] md:pb-[4rem]">
          <div
            class="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-start md:w-1/2">
            <div
              class="mr-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-yellow px-4 py-4">
              1
            </div>
            <h3 class="text-hiw-label md:pr-10 xl:text-hiw-label-xl">
              Anytime content is captured, created, or edited, Content
              Credentials can be attached
            </h3>
          </div>
          <p
            class="2xl:text-hiw-desc-2xl text-hiw-desc text-gray-900/60 md:w-1/2 lg:pt-0 xl:text-hiw-desc-xl mb-[32px] md:mb-0 pt-[16px] md:pt-0">
            Creators can choose to attach Content Credentials to their content,
            which might include things like whether AI was used or not. Voila!
            This information is added to the edit history of the
            content—creating a record that can be confirmed.
          </p>
        </div>
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          src={Hiw1}
          alt="A phone in someones hand, displaying a photo of the
          surrounding snowy landscape and a penguin. The option
          to enable Content Credentials for the photo is available"
          class="max-w[71.375rem] rounded-xl lg:rounded-[20px] 2xl:w-full" />
      </div>
      <div
        class="max-w-[90rem] pt-[96px] lg:max-w-[1145px] xl:max-w-[116rem] xl:px-[10rem] xl:pt-[128px] 2xl:pt-[160px]">
        <div
          class="flex max-w-[86rem] flex-col items-start justify-between md:flex-row xl:pb-[4rem] md:pb-[4rem]">
          <div
            class="flex w-full flex-col items-center gap-4 md:flex-row md:items-start md:justify-start md:w-1/2">
            <div
              class="mr-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-orange px-4 py-4">
              2
            </div>
            <h3
              class="w-full text-left text-hiw-label md:pr-10 xl:text-hiw-label-xl">
              Content Credentials are viewable across the internet
            </h3>
          </div>
          <p
            class="2xl:text-hiw-desc-2xl text-hiw-desc text-gray-900/60 md:w-1/2 lg:pt-0 xl:text-hiw-desc-xl mb-[32px] md:mb-0 pt-[16px] md:pt-0">
            Once the content is made available, anyone can view its Content
            Credentials by clicking the pin, which reveals the most relevant
            information directly in context.
          </p>
        </div>
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          src={Hiw2}
          alt="Penguins in a desert with sand dunes in the background.
          Content Credentials information is displayed over the
          image, including that AI was used to generate some of
          the content, who produced the content, and more"
          class="max-w[71.375rem] rounded-xl lg:rounded-[20px] 2xl:w-full" />
      </div>
      <!-- Video Component -->
      <div
        class="max-w-[90rem] pt-[96px] lg:max-w-[1145px] xl:max-w-[116rem] xl:px-[10rem] xl:pt-[128px] 2xl:pt-[160px]">
        <div
          class="flex max-w-[86rem] flex-col items-start justify-between lg:pb-[3.5rem] md:flex-row xl:pb-[4rem] md:pb-[4rem]">
          <div
            class="flex w-full flex-col items-center gap-4 md:flex-row md:items-start md:justify-start md:w-1/2">
            <div
              class="mr-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-red px-4 py-4">
              3
            </div>
            <h3
              class="w-full text-left text-hiw-label md:pr-10 xl:text-hiw-label-xl">
              Go deeper to explore the full edit history
            </h3>
          </div>
          <p
            class="2xl:text-hiw-desc-2xl text-hiw-desc text-gray-900/60 md:w-1/2 lg:pt-0 xl:text-hiw-desc-xl mb-[32px] md:mb-0 pt-[16px] md:pt-0">
            Content Credentials can capture a detailed history of changes over
            time. The Verify feature allows you to explore this information in
            depth. Check any content to see if it has Content Credentials.
          </p>
        </div>
        <video
          autoplay
          loop
          muted
          playsinline
          src={Video}
          class="dropshadow h-full max-h-full w-full max-w-full rounded-xl object-cover lg:rounded-[20px] xl:h-full"
          alt="A tree view of the relationship between different images
          and how they were used together to create a final image
          over time, available in the Verify feature" />
      </div>
    </div>
  </div>

  <!-- Desktop 1281px+ -->
  <div class="2xl:flex hidden w-full max-w-[90rem] flex-col items-center">
    <div class="grid grid-cols-12">
      <div class="col-start-2 col-end-6">
        <div class="flex flex-row justify-start gap-2">
          <span
            class="mr-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-yellow px-4 py-4"
            >1</span>
          <p class="xl:text-hiw-label-xl">
            Anytime content is captured, created, or edited, Content Credentials
            can be attached
          </p>
        </div>
      </div>
      <div
        class="2xl:text-hiw-desc-2xl col-start-7 col-end-12 text-gray-900/60">
        Creators can choose to attach Content Credentials to their content,
        which might include things like whether AI was used or not. Voila! This
        information is added to the edit history of the content—creating a
        permanent record that can be confirmed.
      </div>
      <div class="col-start-2 col-end-12 mt-[4rem]">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          src={Hiw1}
          alt="A phone in someones hand, displaying a photo of the
        surrounding snowy landscape and a penguin. The option
        to enable Content Credentials for the photo is available"
          class="max-w[71.375rem] 2xl:w-full rounded-xl lg:rounded-[20px]" />
      </div>
      <div class="col-start-2 col-end-6 mt-[10rem]">
        <div class="flex flex-row justify-start gap-2">
          <span
            class="mr-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-yellow px-4 py-4"
            >2</span>
          <p class="xl:text-hiw-label-xl">
            Content Credentials are viewable across the internet
          </p>
        </div>
      </div>
      <div
        class="2xl:text-hiw-desc-2xl col-start-7 col-end-12 mt-[10rem] text-gray-900/60">
        Once the content is made available, anyone can view its Content
        Credentials by clicking the pin, which reveals the most relevant
        information directly in context.
      </div>
      <div class="col-start-2 col-end-12 mt-[4rem]">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          src={Hiw2}
          alt="A phone in someones hand, displaying a photo of the
        surrounding snowy landscape and a penguin. The option
        to enable Content Credentials for the photo is available"
          class="max-w[71.375rem] 2xl:w-full rounded-xl lg:rounded-[20px]" />
      </div>
      <div class="col-start-2 col-end-6 mt-[10rem]">
        <div class="flex flex-row justify-start gap-2">
          <span
            class="mr-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-yellow px-4 py-4"
            >3</span>
          <p class="xl:text-hiw-label-xl">
            Go deeper to explore the full edit history
          </p>
        </div>
      </div>
      <div
        class="2xl:text-hiw-desc-2xl col-start-7 col-end-12 mt-[10rem] text-gray-900/60">
        Content Credentials can capture a detailed history of changes over time.
        The Verify feature allows you to explore this information in depth, and
        upload any content to see if it has Content Credentials.
      </div>
      <div class="col-start-2 col-end-12 mt-[4rem]">
        <video
          autoplay
          loop
          muted
          playsinline
          src={Video}
          class="dropshadow h-full max-h-full w-full max-w-full rounded-xl object-cover lg:rounded-[20px] xl:h-full"
          alt="A tree view of the relationship between different images
          and how they were used together to create a final image
          over time, available in the Verify feature" />
      </div>
    </div>
    <!-- Desktop 1280px+ -->
  </div>
</div>

<style>
  .dropshadow {
    filter: drop-shadow(0px 1px 40px #e6e6e6);
  }
</style>
