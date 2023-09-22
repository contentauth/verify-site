// ADOBE CONFIDENTIAL
// Copyright 2023 Adobe
// All Rights Reserved.
//
// NOTICE: All information contained herein is, and remains
// the property of Adobe and its suppliers, if any. The intellectual
// and technical concepts contained herein are proprietary to Adobe
// and its suppliers and are protected by all applicable intellectual
// property laws, including trade secret and copyright laws.
// Dissemination of this information or reproduction of this material
// is strictly forbidden unless prior written permission is obtained
// from Adobe.

import YouTubeLogo from '$assets/svg/color/logos/YT.svg?component';
import AdobeExpressLogo from '$assets/svg/color/logos/adobe-express.svg?component';
import AdobeStockLogo from '$assets/svg/color/logos/adobe-stock.svg?component';
import AdobeLogo from '$assets/svg/color/logos/adobe.svg?component';
import BehanceLogo from '$assets/svg/color/logos/behance.svg?component';
import FacebookLogo from '$assets/svg/color/logos/facebook.svg?component';
import InstagramLogo from '$assets/svg/color/logos/instagram.svg?component';
import LeicaLogo from '$assets/svg/color/logos/leica_logo.svg?component';
import LightroomLogo from '$assets/svg/color/logos/lightroom.svg?component';
import LinkedInLogo from '$assets/svg/color/logos/linkedin.svg?component';
import NikonLogo from '$assets/svg/color/logos/nikon.svg?component';
import PhotoshopLogo from '$assets/svg/color/logos/photoshop.svg?component';
import PinterestLogo from '$assets/svg/color/logos/pinterest.svg?component';
import TruepicLogo from '$assets/svg/color/logos/truepic.svg?component';
import TwitterLogo from '$assets/svg/color/logos/twitter.svg?component';
import VimeoLogo from '$assets/svg/color/logos/vimeo.svg?component';

const matchers = [
  { pattern: /nikon/i, icon: NikonLogo, name: 'Nikon' },
  { pattern: /photoshop/i, icon: PhotoshopLogo, name: 'Photoshop' },
  { pattern: /adobe\sexpress/i, icon: AdobeExpressLogo, name: 'Adobe Express' },
  { pattern: /adobe\sstock/i, icon: AdobeStockLogo, name: 'Adobe Stock' },
  { pattern: /adobe/i, icon: AdobeLogo, name: 'Adobe' },
  { pattern: /behance\.net/i, icon: BehanceLogo, name: 'Behance' },
  { pattern: /facebook\.com/i, icon: FacebookLogo, name: 'Facebook' },
  { pattern: /instagram\.com/i, icon: InstagramLogo, name: 'Instagram' },
  { pattern: /linkedin\.com/i, icon: LinkedInLogo, name: 'LinkedIn' },
  // Behance staging
  {
    pattern: /net\.s2stagehance\.com/i,
    icon: BehanceLogo,
    name: 'Behance (staging)',
  },
  { pattern: /truepic/i, icon: TruepicLogo, name: 'Truepic' },
  { pattern: /twitter\.com/i, icon: TwitterLogo, name: 'Twitter' },
  { pattern: /pinterest\.com/i, icon: PinterestLogo, name: 'Pinterest' },
  { pattern: /vimeo\.com/i, icon: VimeoLogo, name: 'Vimeo' },
  { pattern: /youtube\.com/i, icon: YouTubeLogo, name: 'YouTube' },
  { pattern: /leica/i, icon: LeicaLogo, name: 'Leica' },
  { pattern: /M11/i, icon: LeicaLogo, name: 'Leica' },
  { pattern: /lightroom/i, icon: LightroomLogo, name: 'Adobe Lightroom' },
];

export function providerInfoFromSocialId(id: string) {
  return matchers.find(({ pattern }) => pattern.test(id));
}
