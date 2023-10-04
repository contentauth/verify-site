<script>
  import Hiw1 from '$assets/svg/logos/homepage/2.svg';
  import Hiw2 from '$assets/svg/logos/homepage/1.svg';
  import Video from '$assets/video/howitworks.mp4';
</script>

<div
  class="bg-brand-gray flex h-full w-screen flex-col items-center px-[1.5rem] pb-40 pt-[4rem] md:pt-[6rem] lg:pt-[8rem] xl:pt-[10rem]"
  id="how-it-works">
  <h2
    class="2xl:text-hiw-title-2xl text-hiw-title md:text-hiw-title-md xl:text-hiw-title-xl">
    How it Works
  </h2>
  <div class="flex w-full flex-col items-center">
    <div class="">
      <div
        class="2xl:pt-[160px] max-w-[90rem] pt-[96px] lg:max-w-[1145px] xl:max-w-[116rem] xl:px-[10rem] xl:pt-[128px]">
        <div
          class="flex max-w-[86rem] flex-col items-start justify-between sm:pb-[3.5rem] lg:flex-row xl:pb-[4rem]">
          <div
            class="flex flex-col items-center md:flex-row md:items-start md:justify-start gap-4 lg:w-1/2">
            <div
              class="mr-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-yellow px-4 py-4">
              1
            </div>
            <h3 class="pr-10 text-hiw-label xl:text-hiw-label-xl">
              Anytime content is captured, created, or edited, Content
              Credentials can be attached
            </h3>
          </div>
          <p
            class="2xl:text-hiw-desc-2xl pt-6 text-hiw-desc text-gray-900/60 lg:w-1/2 lg:pt-0 xl:text-hiw-desc-xl">
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
          class="max-w[71.375rem] 2xl:w-full rounded-xl lg:rounded-[20px]" />
      </div>
      <div
        class="2xl:pt-[160px] max-w-[90rem] pt-[96px] lg:max-w-[1145px] xl:max-w-[116rem] xl:px-[10rem] xl:pt-[128px]">
        <div
          class="flex max-w-[86rem] flex-col items-start justify-between sm:pb-[3.5rem] lg:flex-row xl:pb-[4rem]">
          <div
            class="flex flex-col items-center w-full md:flex-row md:items-start md:justify-start gap-4 lg:w-1/2">
            <div
              class="mr-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-orange px-4 py-4">
              2
            </div>
            <h3
              class="pr-10 text-hiw-label xl:text-hiw-label-xl w-full text-left">
              Content Credentials are viewable across the internet
            </h3>
          </div>
          <p
            class="2xl:text-hiw-desc-2xl pt-6 text-hiw-desc text-gray-900/60 lg:w-1/2 lg:pt-0 xl:text-hiw-desc-xl">
            Once the content is published, anyone can view its Content
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
          class="max-w[71.375rem] 2xl:w-full rounded-xl lg:rounded-[20px]" />
      </div>
      <!-- Video Component -->
      <div
        class="2xl:pt-[160px] max-w-[90rem] pt-[96px] lg:max-w-[1145px] xl:max-w-[116rem] xl:px-[10rem] xl:pt-[128px]">
        <div
          class="flex max-w-[86rem] flex-col items-start justify-between sm:pb-[3.5rem] lg:flex-row xl:pb-[4rem]">
          <div
            class="flex flex-col items-center w-full md:flex-row md:items-start md:justify-start gap-4 lg:w-1/2">
            <div
              class="mr-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand-red px-4 py-4">
              3
            </div>
            <h3
              class="pr-10 text-hiw-label xl:text-hiw-label-xl w-full text-left">
              Go deeper to explore the full edit history
            </h3>
          </div>
          <p
            class="2xl:text-hiw-desc-2xl pt-6 text-hiw-desc text-gray-900/60 lg:w-1/2 lg:pt-0 xl:text-hiw-desc-xl">
            Content Credentials can capture a detailed history of changes over
            time. The <a href="/verify" class="underline">Verify</a> feature allows
            you to explore this information in depth, and upload any content to see
            if it has Content Credentials.
          </p>
        </div>
        <video
          autoplay
          loop
          muted
          src={Video}
          class="h-full max-h-full w-full max-w-full rounded-xl lg:rounded-[20px] object-cover xl:h-full"
          alt="A tree view of the relationship between different images
          and how they were used together to create a final image
          over time, available in the Verify feature" />
      </div>
    </div>
  </div>
</div>
