<script>
  import MobileLogo from '$assets/svg/logos/homepage/crvertical.svg';
  import Logo from '$assets/svg/monochrome/text-logo.svg';
</script>

<div class="h-[6.25rem] w-screen px-[1.25rem] sm:px-[2rem] xl:px-[2rem]">
  <div class="flex flex-row items-center justify-between pt-6">
    <div class="pr-6">
      <a href="/">
        <img
          src={Logo}
          width="250px"
          height="100px"
          alt="content credentials"
          class="hidden sm:flex" />
        <img
          src={MobileLogo}
          height="46px"
          alt="content credentials"
          class="max-h-[46px] sm:hidden" />
      </a>
    </div>
    <!-- <div class="pl-6">
      <a href="/verify">
        <div
          class="w-[100px] h-[2.75rem] rounded-full bg-brand-red px-[1.25rem] flex items-center justify-center text-center text-general hover:bg-brand-red/80">
          Verify
        </div>
      </a>
    </div> -->
  </div>
</div>
