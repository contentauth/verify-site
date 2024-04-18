<!--
  ADOBE CONFIDENTIAL
  Copyright 2020 Adobe
  All Rights Reserved.

  NOTICE: All information contained herein is, and remains
  the property of Adobe and its suppliers, if any. The intellectual
  and technical concepts contained herein are proprietary to Adobe
  and its suppliers and are protected by all applicable intellectual
  property laws, including trade secret and copyright laws.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe.
-->

<script>
  // For some reason, this is not picking up global.d.ts
  // eslint-disable-next-line no-undef
  const currentYear = __CURRENT_YEAR__;
</script>

<div
  class="flex h-[238px] w-screen flex-col items-center border-t border-solid border-brand-gray px-6 py-5 md:h-[140px] md:py-8 lg:mt-12 lg:h-[86px] lg:py-6 lg:py-6 xl:mt-[7.5rem]">
  <div
    class="flex h-full w-full flex-col justify-between text-gray-900/60 lg:flex-row lg:items-center">
    <div class="flex flex-col items-start gap-6 text-footer-text md:flex-row">
      <div>Copyright © {currentYear} C2PA</div>

      <div class="text-footer-text">All rights reserved</div>
      <a
        href="https://jointdevelopment.org/policies/terms/"
        target="_blank"
        rel="noreferrer noopener">
        <div class="text-footer-text">Terms of Service and Privacy Policy</div>
      </a>
    </div>
    <a href="/"> <div class="text-footer-text">Top of page</div> </a>
  </div>
</div>
