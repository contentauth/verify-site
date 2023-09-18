<script>
  import CAI from '../../../assets/png/CAI_White.png';
  import Facebook from '../../../assets/png/Facebook.png';
  import Instagram from '../../../assets/png/Vector.png';
  import Twitter from '../../../assets/png/Twitter.png';
  import Linkedin from '../../../assets/png/Linkedin.png';
  const footerIcons = [
    { image: Facebook, url: '/facebook' },
    { image: Instagram, url: '/instagram' },
    { image: Twitter, url: '/twitter' },
    { image: Linkedin, url: '/linkedin' },
  ];
</script>

<div
  class="flex h-[75px] w-screen flex-row items-center border-t-2 border-solid border-gray-200 " >
  <div class="flex w-full flex-row justify-between px-6 text-gray-500">
    <div class="flex flex-row items-center gap-6">
      <div>Copyright 2023 Content Credentials</div>

      <div>All rights reserved</div>
      <a href="/privacy"> <div>Privacy</div> </a>
      <a href="/terms-of-use"> <div>Terms of use</div> </a>
    </div>
    <a href="/"> <div>Top of page</div> </a>
  </div>
</div>

<!-- <div
  class="inset-x-0 bottom-0 flex h-[600px] w-screen justify-center bg-gray-900 text-white">
  <div class="w-full p-[80px]">
    <div class="flex w-full justify-between py-6 pb-20">
      <div>
        <div class="text-subHeading pb-5px">Join our Newsletter</div>
        <p class="text-base font-light">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
      <div>
        <div>
          <input
            type="text"
            placeholder="Enter your Email"
            class=" h-[48px] w-[80%] rounded-full border-2 border-solid border-[#FCE458] bg-gray-900 px-4 text-white/80 placeholder:text-white/80 focus:outline-none" />
          <button
            class="h-[40px] rounded-full border bg-[#FCE458] px-4 py-2 font-bold text-gray-900 hover:bg-[#ffeb77] hover:text-[#454545]">
            Subscribe
          </button>
        </div>
        <p class="text-footerText px-2 pt-4">
          By subscribing you agree to with our{' '}
          <span class="underline">Privacy Policy</span> and provide consent to receive
          updates from our company.
        </p>
      </div>
    </div>
    <hr class="py-4 pb-6" />
    <div class="pb-14 pt-6">
      <div class="flex flex-row items-center justify-between">
        <div>
          <div class="py-4 pb-10">
            <img src={CAI} color="white" alt="CAI Logo" />
          </div>
          <div class="flex flex-row">
            {#each footerIcons as item, index (item.image)}
              <div class="px-4" key={index}>
                <a href={item.url}>
                  <img src={item.image} width="20" height="20" alt="socials" />
                </a>
              </div>
            {/each}
          </div>
        </div>
        <div class="flex flex-row">
          <div class="px-6">
            <div class="py-2">How it Works</div>
            <div class="py-2">Our Members</div>
            <div class="py-2">Join Us</div>
          </div>
          <div class="px-6">
            <div class="py-2">Brand Assets</div>
            <div class="py-2">Blogs</div>
            <div class="py-2">Case Studies</div>
          </div>
          <div class="px-6">
            <div class="py-2">Open-Source Tools</div>
            <div class="py-2">Verify</div>
            <div class="py-2">FAQ</div>
          </div>
        </div>
      </div>
    </div>
    <hr class="pb-2 pt-4" />
    <div class="">
      <div class="flex flex-row items-center justify-between">
        <div>Copyright © 2023 Adobe. All rights reserved.</div>
        <div class="flex flex-row">
          <div class="px-4">Privacy Policy</div>
          <div class="px-4">Terms of Use</div>
        </div>
      </div>
    </div>
  </div>
</div> -->
