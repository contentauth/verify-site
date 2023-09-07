// vite.config.js
import { sveltekit } from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/@sveltejs+kit@1.24.1_svelte@4.2.0_vite@4.2.3/node_modules/@sveltejs/kit/src/exports/vite/index.js";
import fs from "fs";
import path2 from "path";
import { replaceCodePlugin } from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/vite-plugin-replace@0.1.1_vite@4.2.3/node_modules/vite-plugin-replace/index.js";

// etc/rollup/plugins/svelte-svg.js
import { createFilter } from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/@rollup+pluginutils@4.2.1/node_modules/@rollup/pluginutils/dist/es/index.js";
import { readFile } from "fs/promises";
import lodash from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/fp.js";
import path from "path";
import { compile } from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/svelte@4.2.0/node_modules/svelte/src/compiler/index.js";
import { optimize } from "file:///Users/dkozma/Projects/contentcredentials.org/node_modules/.pnpm/svgo@3.0.2/node_modules/svgo/lib/svgo-node.js";
var { flow, camelCase, upperFirst } = lodash;
var classCase = flow([camelCase, upperFirst]);
var colorOverrides = [
  {
    name: "preset-default",
    params: {
      overrides: {
        removeViewBox: false,
        mergePaths: false,
        convertShapeToPath: false,
        convertPathData: false,
        convertColors: false,
        removeUselessStrokeAndFill: false,
        cleanupIds: false
      }
    }
  },
  {
    name: "addAttributesToSVGElement",
    params: {
      attributes: [
        {
          preserveAspectRatio: "xMidYMid meet"
        },
        {
          part: "svg"
        }
      ]
    }
  }
];
var monochromeOverrides = [
  ...colorOverrides,
  "removeStyleElement",
  {
    name: "removeAttrs",
    params: {
      attrs: ["id", "stroke", "fill"]
    }
  }
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
    generate: ssr ? "ssr" : "dom",
    hydratable: true,
    filename: id
  });
  return js;
}
function rollupSvelteSvg(options = {}) {
  const filter = createFilter(options.include, options.exclude);
  return {
    name: "rollup-svelte-svg",
    async transform(svg, id, opts) {
      const ssr = !!(opts == null ? void 0 : opts.ssr);
      if (!filter(id) || path.extname(id) !== ".svg?component") {
        return null;
      }
      try {
        const { name, dir } = path.parse(id);
        const isMonochrome = dir.split(path.sep).includes("monochrome");
        const filename = id.replace(/\.svg(\?.*)$/, ".svg");
        const svgFile = await readFile(filename, { encoding: "utf-8" });
        const overrides = isMonochrome ? monochromeOverrides : colorOverrides;
        const config2 = { path: id, plugins: overrides };
        const optimized = optimize(svgFile, config2);
        const { code, map } = renderElement({
          name,
          isMonochrome,
          svg: optimized.data,
          id,
          ssr
        });
        return { code, map };
      } catch (err) {
        const message = "Could not process SVG file";
        const position = parseInt(/[\d]/.exec(err.message)[0], 10);
        this.warn({ message, id, position });
        return null;
      }
    }
  };
}

// vite.config.js
var __vite_injected_original_dirname = "/Users/dkozma/Projects/contentcredentials.org";
function getSupportedLocales() {
  const dictPath = path2.resolve(__vite_injected_original_dirname, "./locales/");
  return fs.readdirSync(dictPath).map((file) => path2.basename(file, ".json"));
}
var config = {
  server: {
    fs: {
      allow: ["assets", "locales"]
    }
  },
  build: {
    minify: "terser",
    terserOptions: {
      // Added since error names were being mangled, resulting in incorrect error handling (CAI-3792)
      keep_classnames: true,
      // image-blob-reduce breaks unless this is disabled
      compress: { evaluate: false }
    }
  },
  plugins: [
    sveltekit(),
    rollupSvelteSvg(),
    replaceCodePlugin({
      replacements: [
        {
          from: "__SUPPORTED_LOCALES__",
          // type defined in global.d.ts
          to: JSON.stringify(getSupportedLocales())
        },
        {
          from: "__OVERRIDE_MANIFEST_RECOVERY_BASE_URL__",
          // type defined in global.d.ts
          to: JSON.stringify(
            process.env.OVERRIDE_MANIFEST_RECOVERY_BASE_URL ?? ""
          )
        },
        {
          from: "__THUMBNAIL_DATA_TYPE__",
          // type defined in global.d.ts
          to: JSON.stringify(process.env.THUMBNAIL_DATA_TYPE ?? "blob")
        }
      ]
    })
  ],
  test: {
    include: ["src/**/*.spec.ts"],
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    setupFilesAfterEnv: ["./src/test/setupAfterEnv.ts"]
  }
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAiZXRjL3JvbGx1cC9wbHVnaW5zL3N2ZWx0ZS1zdmcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZGtvem1hL1Byb2plY3RzL2NvbnRlbnRjcmVkZW50aWFscy5vcmdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9ka296bWEvUHJvamVjdHMvY29udGVudGNyZWRlbnRpYWxzLm9yZy92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZGtvem1hL1Byb2plY3RzL2NvbnRlbnRjcmVkZW50aWFscy5vcmcvdml0ZS5jb25maWcuanNcIjsvLyBBRE9CRSBDT05GSURFTlRJQUxcbi8vIENvcHlyaWdodCAyMDIzIEFkb2JlXG4vLyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy9cbi8vIE5PVElDRTogQWxsIGluZm9ybWF0aW9uIGNvbnRhaW5lZCBoZXJlaW4gaXMsIGFuZCByZW1haW5zXG4vLyB0aGUgcHJvcGVydHkgb2YgQWRvYmUgYW5kIGl0cyBzdXBwbGllcnMsIGlmIGFueS4gVGhlIGludGVsbGVjdHVhbFxuLy8gYW5kIHRlY2huaWNhbCBjb25jZXB0cyBjb250YWluZWQgaGVyZWluIGFyZSBwcm9wcmlldGFyeSB0byBBZG9iZVxuLy8gYW5kIGl0cyBzdXBwbGllcnMgYW5kIGFyZSBwcm90ZWN0ZWQgYnkgYWxsIGFwcGxpY2FibGUgaW50ZWxsZWN0dWFsXG4vLyBwcm9wZXJ0eSBsYXdzLCBpbmNsdWRpbmcgdHJhZGUgc2VjcmV0IGFuZCBjb3B5cmlnaHQgbGF3cy5cbi8vIERpc3NlbWluYXRpb24gb2YgdGhpcyBpbmZvcm1hdGlvbiBvciByZXByb2R1Y3Rpb24gb2YgdGhpcyBtYXRlcmlhbFxuLy8gaXMgc3RyaWN0bHkgZm9yYmlkZGVuIHVubGVzcyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24gaXMgb2J0YWluZWRcbi8vIGZyb20gQWRvYmUuXG5cbmltcG9ydCB7IHN2ZWx0ZWtpdCB9IGZyb20gJ0BzdmVsdGVqcy9raXQvdml0ZSc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyByZXBsYWNlQ29kZVBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXJlcGxhY2UnO1xuaW1wb3J0IHN2ZWx0ZVN2ZyBmcm9tICcuL2V0Yy9yb2xsdXAvcGx1Z2lucy9zdmVsdGUtc3ZnJztcblxuZnVuY3Rpb24gZ2V0U3VwcG9ydGVkTG9jYWxlcygpIHtcbiAgY29uc3QgZGljdFBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9sb2NhbGVzLycpO1xuXG4gIHJldHVybiBmcy5yZWFkZGlyU3luYyhkaWN0UGF0aCkubWFwKChmaWxlKSA9PiBwYXRoLmJhc2VuYW1lKGZpbGUsICcuanNvbicpKTtcbn1cblxuLyoqIEB0eXBlIHtpbXBvcnQoJ3ZpdGUnKS5Vc2VyQ29uZmlnfSAqL1xuY29uc3QgY29uZmlnID0ge1xuICBzZXJ2ZXI6IHtcbiAgICBmczoge1xuICAgICAgYWxsb3c6IFsnYXNzZXRzJywgJ2xvY2FsZXMnXSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgLy8gQWRkZWQgc2luY2UgZXJyb3IgbmFtZXMgd2VyZSBiZWluZyBtYW5nbGVkLCByZXN1bHRpbmcgaW4gaW5jb3JyZWN0IGVycm9yIGhhbmRsaW5nIChDQUktMzc5MilcbiAgICAgIGtlZXBfY2xhc3NuYW1lczogdHJ1ZSxcbiAgICAgIC8vIGltYWdlLWJsb2ItcmVkdWNlIGJyZWFrcyB1bmxlc3MgdGhpcyBpcyBkaXNhYmxlZFxuICAgICAgY29tcHJlc3M6IHsgZXZhbHVhdGU6IGZhbHNlIH0sXG4gICAgfSxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHN2ZWx0ZWtpdCgpLFxuICAgIHN2ZWx0ZVN2ZygpLFxuICAgIHJlcGxhY2VDb2RlUGx1Z2luKHtcbiAgICAgIHJlcGxhY2VtZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgZnJvbTogJ19fU1VQUE9SVEVEX0xPQ0FMRVNfXycsIC8vIHR5cGUgZGVmaW5lZCBpbiBnbG9iYWwuZC50c1xuICAgICAgICAgIHRvOiBKU09OLnN0cmluZ2lmeShnZXRTdXBwb3J0ZWRMb2NhbGVzKCkpLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZnJvbTogJ19fT1ZFUlJJREVfTUFOSUZFU1RfUkVDT1ZFUllfQkFTRV9VUkxfXycsIC8vIHR5cGUgZGVmaW5lZCBpbiBnbG9iYWwuZC50c1xuICAgICAgICAgIHRvOiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgIHByb2Nlc3MuZW52Lk9WRVJSSURFX01BTklGRVNUX1JFQ09WRVJZX0JBU0VfVVJMID8/ICcnLFxuICAgICAgICAgICksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBmcm9tOiAnX19USFVNQk5BSUxfREFUQV9UWVBFX18nLCAvLyB0eXBlIGRlZmluZWQgaW4gZ2xvYmFsLmQudHNcbiAgICAgICAgICB0bzogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuVEhVTUJOQUlMX0RBVEFfVFlQRSA/PyAnYmxvYicpLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KSxcbiAgXSxcbiAgdGVzdDoge1xuICAgIGluY2x1ZGU6IFsnc3JjLyoqLyouc3BlYy50cyddLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6IFsnLi9zcmMvdGVzdC9zZXR1cC50cyddLFxuICAgIHNldHVwRmlsZXNBZnRlckVudjogWycuL3NyYy90ZXN0L3NldHVwQWZ0ZXJFbnYudHMnXSxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2Rrb3ptYS9Qcm9qZWN0cy9jb250ZW50Y3JlZGVudGlhbHMub3JnL2V0Yy9yb2xsdXAvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2Rrb3ptYS9Qcm9qZWN0cy9jb250ZW50Y3JlZGVudGlhbHMub3JnL2V0Yy9yb2xsdXAvcGx1Z2lucy9zdmVsdGUtc3ZnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9ka296bWEvUHJvamVjdHMvY29udGVudGNyZWRlbnRpYWxzLm9yZy9ldGMvcm9sbHVwL3BsdWdpbnMvc3ZlbHRlLXN2Zy5qc1wiOy8vIEFET0JFIENPTkZJREVOVElBTFxuLy8gQ29weXJpZ2h0IDIwMjMgQWRvYmVcbi8vIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vL1xuLy8gTk9USUNFOiBBbGwgaW5mb3JtYXRpb24gY29udGFpbmVkIGhlcmVpbiBpcywgYW5kIHJlbWFpbnNcbi8vIHRoZSBwcm9wZXJ0eSBvZiBBZG9iZSBhbmQgaXRzIHN1cHBsaWVycywgaWYgYW55LiBUaGUgaW50ZWxsZWN0dWFsXG4vLyBhbmQgdGVjaG5pY2FsIGNvbmNlcHRzIGNvbnRhaW5lZCBoZXJlaW4gYXJlIHByb3ByaWV0YXJ5IHRvIEFkb2JlXG4vLyBhbmQgaXRzIHN1cHBsaWVycyBhbmQgYXJlIHByb3RlY3RlZCBieSBhbGwgYXBwbGljYWJsZSBpbnRlbGxlY3R1YWxcbi8vIHByb3BlcnR5IGxhd3MsIGluY2x1ZGluZyB0cmFkZSBzZWNyZXQgYW5kIGNvcHlyaWdodCBsYXdzLlxuLy8gRGlzc2VtaW5hdGlvbiBvZiB0aGlzIGluZm9ybWF0aW9uIG9yIHJlcHJvZHVjdGlvbiBvZiB0aGlzIG1hdGVyaWFsXG4vLyBpcyBzdHJpY3RseSBmb3JiaWRkZW4gdW5sZXNzIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbiBpcyBvYnRhaW5lZFxuLy8gZnJvbSBBZG9iZS5cblxuaW1wb3J0IHsgY3JlYXRlRmlsdGVyIH0gZnJvbSAnQHJvbGx1cC9wbHVnaW51dGlscyc7XG5pbXBvcnQgeyByZWFkRmlsZSB9IGZyb20gJ2ZzL3Byb21pc2VzJztcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoL2ZwJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgY29tcGlsZSB9IGZyb20gJ3N2ZWx0ZS9jb21waWxlcic7XG5pbXBvcnQgeyBvcHRpbWl6ZSB9IGZyb20gJ3N2Z28nO1xuXG5jb25zdCB7IGZsb3csIGNhbWVsQ2FzZSwgdXBwZXJGaXJzdCB9ID0gbG9kYXNoO1xuXG5jb25zdCBjbGFzc0Nhc2UgPSBmbG93KFtjYW1lbENhc2UsIHVwcGVyRmlyc3RdKTtcblxuY29uc3QgY29sb3JPdmVycmlkZXMgPSBbXG4gIHtcbiAgICBuYW1lOiAncHJlc2V0LWRlZmF1bHQnLFxuICAgIHBhcmFtczoge1xuICAgICAgb3ZlcnJpZGVzOiB7XG4gICAgICAgIHJlbW92ZVZpZXdCb3g6IGZhbHNlLFxuICAgICAgICBtZXJnZVBhdGhzOiBmYWxzZSxcbiAgICAgICAgY29udmVydFNoYXBlVG9QYXRoOiBmYWxzZSxcbiAgICAgICAgY29udmVydFBhdGhEYXRhOiBmYWxzZSxcbiAgICAgICAgY29udmVydENvbG9yczogZmFsc2UsXG4gICAgICAgIHJlbW92ZVVzZWxlc3NTdHJva2VBbmRGaWxsOiBmYWxzZSxcbiAgICAgICAgY2xlYW51cElkczogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICBuYW1lOiAnYWRkQXR0cmlidXRlc1RvU1ZHRWxlbWVudCcsXG4gICAgcGFyYW1zOiB7XG4gICAgICBhdHRyaWJ1dGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBwcmVzZXJ2ZUFzcGVjdFJhdGlvOiAneE1pZFlNaWQgbWVldCcsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwYXJ0OiAnc3ZnJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbl07XG5cbmNvbnN0IG1vbm9jaHJvbWVPdmVycmlkZXMgPSBbXG4gIC4uLmNvbG9yT3ZlcnJpZGVzLFxuICAncmVtb3ZlU3R5bGVFbGVtZW50JyxcbiAge1xuICAgIG5hbWU6ICdyZW1vdmVBdHRycycsXG4gICAgcGFyYW1zOiB7XG4gICAgICBhdHRyczogWydpZCcsICdzdHJva2UnLCAnZmlsbCddLFxuICAgIH0sXG4gIH0sXG5dO1xuXG5mdW5jdGlvbiByZW5kZXJFbGVtZW50KHsgaXNNb25vY2hyb21lLCBuYW1lLCBzdmcsIGlkLCBzc3IgfSkge1xuICBjb25zdCBjbGFzc05hbWUgPSBjbGFzc0Nhc2UobmFtZSk7XG4gIGNvbnN0IGNvZGUgPSBgXG4gICAgPHNjcmlwdCBsYW5nPVwidHNcIj5cbiAgICAgIGV4cG9ydCBsZXQgd2lkdGggPSAxNjtcbiAgICAgIGV4cG9ydCBsZXQgaGVpZ2h0ID0gMTY7XG4gICAgPC9zY3JpcHQ+XG5cbiAgICA8ZGl2IGNsYXNzPXskJHByb3BzLmNsYXNzfSBzdHlsZT1cIndpZHRoOiB7d2lkdGh9OyBoZWlnaHQ6IHtoZWlnaHR9O1wiPlxuICAgICAgJHtzdmd9XG4gICAgPC9kaXY+XG5cbiAgICA8c3R5bGUgbGFuZz1cInBvc3Rjc3NcIj5cbiAgICAgIHN2ZyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGZpbGw6IGN1cnJlbnRDb2xvcjtcbiAgICAgIH1cblxuICAgICAgcGF0aCB7IFxuICAgICAgICAke2lzTW9ub2Nocm9tZSA/IGBmaWxsOiBpbmhlcml0O2AgOiBgYH1cbiAgICAgIH1cbiAgICA8L3N0eWxlPlxuICBgO1xuICBjb25zdCB7IGpzIH0gPSBjb21waWxlKGNvZGUsIHtcbiAgICBuYW1lOiBjbGFzc05hbWUsXG4gICAgZ2VuZXJhdGU6IHNzciA/ICdzc3InIDogJ2RvbScsXG4gICAgaHlkcmF0YWJsZTogdHJ1ZSxcbiAgICBmaWxlbmFtZTogaWQsXG4gIH0pO1xuXG4gIHJldHVybiBqcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm9sbHVwU3ZlbHRlU3ZnKG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBmaWx0ZXIgPSBjcmVhdGVGaWx0ZXIob3B0aW9ucy5pbmNsdWRlLCBvcHRpb25zLmV4Y2x1ZGUpO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3JvbGx1cC1zdmVsdGUtc3ZnJyxcbiAgICBhc3luYyB0cmFuc2Zvcm0oc3ZnLCBpZCwgb3B0cykge1xuICAgICAgY29uc3Qgc3NyID0gISFvcHRzPy5zc3I7XG5cbiAgICAgIGlmICghZmlsdGVyKGlkKSB8fCBwYXRoLmV4dG5hbWUoaWQpICE9PSAnLnN2Zz9jb21wb25lbnQnKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7IG5hbWUsIGRpciB9ID0gcGF0aC5wYXJzZShpZCk7XG4gICAgICAgIGNvbnN0IGlzTW9ub2Nocm9tZSA9IGRpci5zcGxpdChwYXRoLnNlcCkuaW5jbHVkZXMoJ21vbm9jaHJvbWUnKTtcblxuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IGlkLnJlcGxhY2UoL1xcLnN2ZyhcXD8uKikkLywgJy5zdmcnKTtcbiAgICAgICAgY29uc3Qgc3ZnRmlsZSA9IGF3YWl0IHJlYWRGaWxlKGZpbGVuYW1lLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuXG4gICAgICAgIGNvbnN0IG92ZXJyaWRlcyA9IGlzTW9ub2Nocm9tZSA/IG1vbm9jaHJvbWVPdmVycmlkZXMgOiBjb2xvck92ZXJyaWRlcztcbiAgICAgICAgY29uc3QgY29uZmlnID0geyBwYXRoOiBpZCwgcGx1Z2luczogb3ZlcnJpZGVzIH07XG4gICAgICAgIGNvbnN0IG9wdGltaXplZCA9IG9wdGltaXplKHN2Z0ZpbGUsIGNvbmZpZyk7XG4gICAgICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSByZW5kZXJFbGVtZW50KHtcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIGlzTW9ub2Nocm9tZSxcbiAgICAgICAgICBzdmc6IG9wdGltaXplZC5kYXRhLFxuICAgICAgICAgIGlkLFxuICAgICAgICAgIHNzcixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHsgY29kZSwgbWFwIH07XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdDb3VsZCBub3QgcHJvY2VzcyBTVkcgZmlsZSc7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gcGFyc2VJbnQoL1tcXGRdLy5leGVjKGVyci5tZXNzYWdlKVswXSwgMTApO1xuICAgICAgICB0aGlzLndhcm4oeyBtZXNzYWdlLCBpZCwgcG9zaXRpb24gfSk7XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFhQSxTQUFTLGlCQUFpQjtBQUMxQixPQUFPLFFBQVE7QUFDZixPQUFPQSxXQUFVO0FBQ2pCLFNBQVMseUJBQXlCOzs7QUNIbEMsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxnQkFBZ0I7QUFDekIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sVUFBVTtBQUNqQixTQUFTLGVBQWU7QUFDeEIsU0FBUyxnQkFBZ0I7QUFFekIsSUFBTSxFQUFFLE1BQU0sV0FBVyxXQUFXLElBQUk7QUFFeEMsSUFBTSxZQUFZLEtBQUssQ0FBQyxXQUFXLFVBQVUsQ0FBQztBQUU5QyxJQUFNLGlCQUFpQjtBQUFBLEVBQ3JCO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixXQUFXO0FBQUEsUUFDVCxlQUFlO0FBQUEsUUFDZixZQUFZO0FBQUEsUUFDWixvQkFBb0I7QUFBQSxRQUNwQixpQkFBaUI7QUFBQSxRQUNqQixlQUFlO0FBQUEsUUFDZiw0QkFBNEI7QUFBQSxRQUM1QixZQUFZO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFB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
