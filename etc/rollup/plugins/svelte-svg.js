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

import { createFilter } from '@rollup/pluginutils';
import { readFile } from 'fs/promises';
import lodash from 'lodash/fp';
import { createHash } from 'node:crypto';
import path from 'path';
import { compile } from 'svelte/compiler';
import { optimize } from 'svgo';

const { flow, camelCase, upperFirst } = lodash;

const classCase = flow([camelCase, upperFirst]);

const colorOverrides = [
  {
    name: 'preset-default',
    params: {
      overrides: {
        removeViewBox: false,
        mergePaths: false,
        convertShapeToPath: false,
        convertPathData: false,
        convertColors: false,
        removeUselessStrokeAndFill: false,
        cleanupIds: false,
      },
    },
  },
  {
    name: 'addAttributesToSVGElement',
    params: {
      attributes: [
        {
          preserveAspectRatio: 'xMidYMid meet',
        },
        {
          part: 'svg',
        },
      ],
    },
  },
];

const monochromeOverrides = [
  ...colorOverrides,
  'removeStyleElement',
  {
    name: 'removeAttrs',
    params: {
      attrs: ['id', 'stroke', 'fill'],
    },
  },
];

function renderElement({ isMonochrome, name, svg, id, ssr }) {
  const className = classCase(name);
  const code = `
    <script lang="ts">
      export let width = 16;
      export let height = 16;
    </script>

    <div class={$$props.class} style="width: {width}; height: {height};">
      ${svg}
    </div>

    <style lang="postcss">
      svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }

      path { 
        ${isMonochrome ? `fill: inherit;` : ``}
      }
    </style>
  `;
  const { js } = compile(code, {
    name: className,
    generate: ssr ? 'ssr' : 'dom',
    hydratable: true,
    filename: id,
  });

  return js;
}

export default function rollupSvelteSvg(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'rollup-svelte-svg',
    async transform(svg, id, opts) {
      const ssr = !!opts?.ssr;

      if (!filter(id) || path.extname(id) !== '.svg?component') {
        return null;
      }

      try {
        const { name, dir } = path.parse(id);
        const isMonochrome = dir.split(path.sep).includes('monochrome');

        const hash = createHash('md5');
        const filename = id.replace(/\.svg(\?.*)$/, '.svg');
        const svgFile = await readFile(filename, { encoding: 'utf-8' });
        hash.update(svgFile);

        const prefix = `${hash.digest('hex')}-`;
        const overrides = isMonochrome ? monochromeOverrides : colorOverrides;
        const plugins = [
          ...overrides,
          {
            name: 'prefixIds',
            params: {
              prefix,
            },
          },
        ];
        const config = { path: id, plugins };
        const optimized = optimize(svgFile, config);
        const { code, map } = renderElement({
          name,
          isMonochrome,
          svg: optimized.data,
          id,
          ssr,
        });

        return { code, map };
      } catch (err) {
        const message = 'Could not process SVG file';
        const position = parseInt(/[\d]/.exec(err.message)[0], 10);
        this.warn({ message, id, position });

        return null;
      }
    },
  };
}
