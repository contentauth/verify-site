<script>
  import Logo from '../../../../assets/png/cc.png';
  import MobileLogo from '$assets/svg/logos/homepage/crvertical.svg';
</script>

<div class="w-full flex justify-center">
  <div
    class="h-[6.25rem] w-full px-[1.25rem] sm:px-[2rem] xl:px-[2rem] max-w-[1440px]">
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
            class="sm:hidden max-h-[46px]" />
        </a>
      </div>
      <div>
        <a href="/verify" class="underline"> Inspect </a>
      </div>
    </div>
  </div>
</div>
