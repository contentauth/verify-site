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
    fontFamily: {
      home: defs['family-home'],
      homeWide: defs['family-home-wide'],
      base: defs['family-base'],
    },
    colors: {
      yellow: 'FCE458',
      white: defs['gray-50'],
      'gray-50': defs['gray-50'],
      'gray-75': defs['gray-75'],
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
      black: defs['black'],
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontSize: {
      title: [
        '1.5rem',
        {
          lineHeight: '1.875rem',
          fontWeight: '900',
        },
      ],
      header: [
        '1.125rem',
        {
          lineHeight: '1.5rem',
          fontWeight: '700',
        },
      ],
      'body-bold': [
        '0.9375rem',
        {
          lineHeight: '1.25rem',
          fontWeight: '700',
        },
      ],
      body: [
        '0.9375rem',
        {
          lineHeight: '1.25rem',
          fontWeight: '400',
        },
      ],
      description: [
        '0.9375rem',
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
        '0.75rem',
        {
          lineHeight: '0.875rem',
          fontWeight: '700',
        },
      ],
      hero: [
        '3.75rem',
        {
          fontWeight: '700',
          lineHeight: '75px',
        },
      ],
      heroNew: [
        '6rem',
        {
          fontWeight: '700',
          lineHeight: '100px',
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
      subHeading: [
        '1.25rem',
        {
          fontWeight: '700',
          lineHeight: '24px',
        },
      ],
      footerText: [
        '0.75rem',
        {
          fontWeight: '400',
          lineHeight: '18px',
        },
      ],
    },
    boxShadow: {
      DEFAULT: '0px 4px 20px rgba(0, 0, 0, 0.3)',
      md: '0px 2px 6px 0px rgba(0, 0, 0, 0.15)',
    },
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/assets/png/Circles.png')",
      },
      backgroundColor: {
        brandRed: '#fe818b',
        brandGreen: '#5ac97d',
        brandYellow: '#fbe756',
        brandOrange: '#ef9449',
        brandViolet: '#888ef8',
        brandBlue: '#84c7fc',
      },
      spacing: {
        sidebar: '20rem',
        header: '3.5rem',
      },
      borderColor: ({ theme }) => ({
        DEFAULT: theme('colors.gray-200'),
      }),
      gridTemplateColumns: {
        table: '38% 28% 28% 6%',
        mobiletable: '67% 22% 10%',
      },
    },
  },
  plugins: [],
} satisfies Config;
