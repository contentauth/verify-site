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

import tailwindForms from '@tailwindcss/forms';
import css from 'css';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Config } from 'tailwindcss';

/**
 * Parses a CSS file and attempts to extract CSS variable definitions from it
 * @param source
 * @param selector
 * @returns An object with variable names as keys and variable values as values
 */
function getCssVariables(source, selector) {
  const varsCss = readFileSync(source, 'utf8');
  const vars = css.parse(varsCss);

  return (
    (vars.stylesheet?.rules ?? [])
      .find((x) => x.type === 'rule' && x.selectors.includes(selector))
      ?.declarations?.reduce((acc, rule) => {
        if (rule.type === 'declaration') {
          acc[rule.property.replace(/^--/, '')] = rule.value;
        }

        return acc;
      }, {}) ?? {}
  );
}

const varsCssPath = resolve(__dirname, 'src', 'vars.css');

// We are extracting the CSS variables from the CSS file instead of referencing the `var(--variable-name)` directly
// since Tailwind's color functions (e.g. background opacity) won't work properly with the latter.
const defs = Object.assign(
  {},
  getCssVariables(varsCssPath, ':root'),
  getCssVariables(varsCssPath, '.theme-light'),
);

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    screens: {
      sm: '478px',
      md: '768px',
      lg: '991px',
      xl: '1280px',
      '2xl': '1281px',
      '3xl': '1440px',
    },
    fontFamily: {
      base: defs['family-base'],
    },
    colors: {
      white: '#ffffff',
      'gray-40': defs['gray-40'],
      'gray-100': defs['gray-100'],
      'gray-200': defs['gray-200'],
      'gray-300': defs['gray-300'],
      'gray-400': defs['gray-400'],
      'gray-500': defs['gray-500'],
      'gray-600': defs['gray-600'],
      'gray-700': defs['gray-700'],
      'gray-800': defs['gray-800'],
      'gray-900': defs['gray-900'],
      'blue-100': defs['blue-100'],
      'blue-200': defs['blue-200'],
      'blue-300': defs['blue-300'],
      'blue-400': defs['blue-400'],
      'blue-500': defs['blue-500'],
      'blue-600': defs['blue-600'],
      'blue-700': defs['blue-700'],
      'blue-800': defs['blue-900'],
      'blue-900': defs['blue-900'],
      'blue-1000': defs['blue-1000'],
      'blue-1100': defs['blue-1100'],
      'blue-1200': defs['blue-1200'],
      'blue-1300': defs['blue-1300'],
      'orange-700': defs['orange-700'],
      'red-900': defs['red-900'],
      'red-1000': defs['red-1000'],
      'brand-red': defs['brand-red'],
      'brand-blue': defs['brand-blue'],
      'brand-green': defs['brand-green'],
      'brand-yellow': defs['brand-yellow'],
      'brand-orange': defs['brand-orange'],
      'brand-violet': defs['brand-violet'],
      'brand-white': defs['brand-white'],
      'brand-gray': defs['brand-gray'],
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontSize: {
      title: [
        '2rem',
        {
          lineHeight: '1.1',
          fontWeight: '700',
        },
      ],
      subtitle: [
        '1.3125rem',
        {
          lineHeight: '1.3',
          fontWeight: '400',
        },
      ],
      header: [
        '1.125rem',
        {
          lineHeight: '1.4625rem',
          fontWeight: '500',
        },
      ],
      'body-bold': [
        '0.875rem',
        {
          lineHeight: '1.4',
          fontWeight: '700',
        },
      ],
      body: [
        '0.875rem',
        {
          lineHeight: '1.4',
          fontWeight: '400',
        },
      ],
      description: [
        '0.875rem',
        {
          lineHeight: '1.25rem',
          fontWeight: '400',
        },
      ],
      'small-description': [
        '0.8125rem',
        {
          lineHeight: '1rem',
          fontWeight: '400',
        },
      ],
      label: [
        '0.875rem',
        {
          lineHeight: '1.4',
          fontWeight: '500',
        },
      ],
      informational: [
        '0.875rem',
        {
          lineHeight: '1.3',
          fontWeight: '400',
        },
      ],

      // For the Homepage
      hero: [
        '3.75rem',
        {
          fontWeight: '700',
          lineHeight: '75px',
        },
      ],
      'hero-title': [
        '3.5rem',
        {
          fontWeight: '700',
          lineHeight: '3.85rem',
        },
      ],
      'hero-title-lg': [
        '4.5rem',
        {
          fontWeight: '700',
          lineHeight: '4.95rem',
          letterSpacing: '-0.135rem',
        },
      ],
      'hero-title-desktop': [
        '6rem',
        {
          fontWeight: '700',
          lineHeight: '6rem',
          letterSpacing: '-0.24rem',
        },
      ],
      'hero-sub': [
        '1.3125rem',
        {
          fontWeight: '400',
          lineHeight: '1.77188rem',
        },
      ],
      'hero-sub-tablet': [
        '1.5rem',
        {
          fontWeight: '400',
          lineHeight: ' 2.025rem',
          letterSpacing: '-0.015rem',
        },
      ],
      'hero-sub-desktop': [
        '1.875rem',
        {
          fontWeight: '400',
          lineHeight: ' 2.53125rem',
          letterSpacing: '-0.01875rem',
        },
      ],
      'home-secondary-title': [
        '2.5rem',
        {
          fontWeight: '700',
          lineHeight: '2.75rem',
          letterSpacing: '-0.075rem',
        },
      ],
      'home-title-md': [
        '3rem',
        {
          fontWeight: '700',
          lineHeight: '3.3rem',
        },
      ],
      'home-title-lg': [
        '3.5rem',
        {
          fontWeight: '700',
          lineHeight: '3.85rem',
          letterSpacing: '-0.105rem',
        },
      ],
      'home-title-2xl': [
        '4.5rem',
        {
          fontWeight: '700',
          lineHeight: '4.95rem',
          letterSpacing: '-0.135rem',
        },
      ],
      'key-title': [
        '1.875rem',
        {
          fontWeight: '700',
          lineHeight: '2.0625rem',
          letterSpacing: '-0.01875rem',
        },
      ],
      'key-title-xl': [
        '2.5rem',
        {
          fontWeight: '700',
          lineHeight: '2.75rem',
          letterSpacing: '-0.075rem',
        },
      ],
      'key-sub-text': [
        '1rem',
        {
          fontWeight: '400',
          lineHeight: '1.35rem ',
        },
      ],
      'key-sub-text-lg': [
        '1.125rem',
        {
          fontWeight: '400',
          lineHeight: '1.51875rem',
        },
      ],
      'key-sub-text-xl': [
        '1.3125rem',
        {
          fontWeight: '400',
          lineHeight: '1.77188rem',
          letterSpacing: '-0.01313rem',
        },
      ],
      'hiw-label': [
        '1.5rem',
        {
          fontWeight: '400',
          lineHeight: '2.025rem',
          letterSpacing: '-0.015rem',
        },
      ],
      'hiw-label-xl': [
        '1.75rem',
        {
          fontWeight: '400',
          lineHeight: '2.3625rem ',
          letterSpacing: '-0.0175rem',
        },
      ],
      'trust-label': [
        '1.5rem',
        {
          fontWeight: '400',
          lineHeight: '2.025rem',
          letterSpacing: '-0.015rem',
        },
      ],
      'stories-title': [
        '2rem',
        {
          fontWeight: '700',
          lineHeight: '2.2rem',
        },
      ],
      'stories-desc': [
        '1.3125rem',
        {
          fontWeight: '400',
          lineHeight: '1.77188rem',
        },
      ],
      'footer-text': [
        '1rem',
        {
          fontWeight: '400',
          lineHeight: '1.1rem',
        },
      ],
      secondaryTitle: [
        '2.25rem',
        {
          fontWeight: '700',
          lineHeight: '43px',
        },
      ],
      general: [
        '1.125rem',
        {
          fontWeight: '400',
          lineHeight: '24px',
        },
      ],
      generalSm: [
        '1rem',
        {
          fontWeight: '400',
          lineHeight: '24px',
        },
      ],
      'sub-heading': [
        '1.875rem',
        {
          fontWeight: '400',
          lineHeight: '40px',
        },
      ],
      'sub-title': [
        '2.5rem',
        {
          fontWeight: '700',
          lineHeight: '44px',
        },
      ],
      'sub-text': [
        '1.3125rem',
        {
          fontWeight: '400',
          lineHeight: '28px',
        },
      ],
      'sub-desc': [
        '1rem',
        {
          fontWeight: '400',
          lineHeight: '24px',
        },
      ],
      'sub-label': [
        '20px',
        {
          fontWeight: '400',
          lineHeight: '28px',
        },
      ],
      'secondary-title': ['4.5rem', { fontWeight: '700', lineHeight: '75px' }],
      footerText: [
        '0.75rem',
        {
          fontWeight: '400',
          lineHeight: '18px',
        },
      ],
      'story-title': [
        '2rem',
        {
          fontWeight: '700',
          lineHeight: '35px',
        },
      ],
      'popup-text': [
        '0.75rem',
        {
          fontWeight: '400',
          lineHeight: '1.0125rem',
          letterSpacing: '-0.0075rem',
        },
      ],
      'popup-title': [
        '1.125rem',
        {
          fontWeight: '400',
          lineHeight: '1.51875rem',
        },
      ],
      // For the Homepage
    },
    boxShadow: {
      DEFAULT: '0px 4px 20px rgba(0, 0, 0, 0.3)',
      md: '0px 2px 6px 0px rgba(0, 0, 0, 0.15)',
      sm: '0px 1px 3px 0px rgba(0, 0, 0, 0.35)',
    },
    extend: {
      spacing: {
        sidebar: '20rem',
        header: '3.5rem',
      },
      translate: {
        'h-screen': '100vh',
      },
      borderColor: ({ theme }) => ({
        DEFAULT: theme('colors.gray-200'),
      }),
      borderRadius: {
        '3xl': '1.25rem',
      },
      gridTemplateColumns: {
        table: '38% 28% 28% 6%',
        mobiletable: '67% 22% 10%',
      },
    },
  },
  plugins: [
    tailwindForms({
      strategy: 'class',
    }),
  ],
} satisfies Config;
