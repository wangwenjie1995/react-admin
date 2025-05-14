// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/wangwenjie/Desktop/Study/react-admin-design/node_modules/.pnpm/vite@5.4.19_@types+node@20.17.32_less@4.3.0_terser@5.39.0/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/wangwenjie/Desktop/Study/react-admin-design/node_modules/.pnpm/@vitejs+plugin-react@4.4.1_vite@5.4.19_@types+node@20.17.32_less@4.3.0_terser@5.39.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///C:/Users/wangwenjie/Desktop/Study/react-admin-design/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.19_@types+node@20.17.32_less@4.3.0_terser@5.39.0_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import { viteMockServe } from "file:///C:/Users/wangwenjie/Desktop/Study/react-admin-design/node_modules/.pnpm/vite-plugin-mock@2.9.8_mockjs@1.1.0_vite@5.4.19_@types+node@20.17.32_less@4.3.0_terser@5.39.0_/node_modules/vite-plugin-mock/dist/index.js";
import ViteCdnImport from "file:///C:/Users/wangwenjie/Desktop/Study/react-admin-design/node_modules/.pnpm/vite-plugin-cdn-import@1.0.1_rollup@4.40.1_vite@5.4.19_@types+node@20.17.32_less@4.3.0_terser@5.39.0_/node_modules/vite-plugin-cdn-import/dist/index.js";
import { viteExternalsPlugin } from "file:///C:/Users/wangwenjie/Desktop/Study/react-admin-design/node_modules/.pnpm/vite-plugin-externals@0.6.2_vite@5.4.19_@types+node@20.17.32_less@4.3.0_terser@5.39.0_/node_modules/vite-plugin-externals/dist/src/index.js";
import { webUpdateNotice } from "file:///C:/Users/wangwenjie/Desktop/Study/react-admin-design/node_modules/.pnpm/@plugin-web-update-notification+vite@2.0.0_vite@5.4.19_@types+node@20.17.32_less@4.3.0_terser@5.39.0_/node_modules/@plugin-web-update-notification/vite/dist/index.js";

// build/utils.ts
function wrapperEnv(envConf) {
  const result = {};
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, "\n");
    realName = realName === "true" ? true : realName === "false" ? false : realName;
    if (envName === "VITE_PORT") {
      realName = Number(realName);
    }
    if (envName === "VITE_PROXY" && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'));
      } catch (error) {
        realName = "";
      }
    }
    result[envName] = realName;
    if (typeof realName === "string") {
      process.env[envName] = realName;
    } else if (typeof realName === "object") {
      process.env[envName] = JSON.stringify(realName);
    }
  }
  return result;
}

// cdn.config.ts
var cdnConfigs = [
  {
    name: "react",
    var: "React",
    path: "https://unpkg.com/react@18.3.1/umd/react.production.min.js"
  },
  {
    name: "react-dom",
    var: "ReactDOM",
    path: "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"
  },
  {
    name: "axios",
    var: "axios",
    path: "https://unpkg.com/axios@1.6.2/dist/axios.min.js"
  }
  // {
  //   name: 'video.js',
  //   var: 'videojs',
  //   path: 'https://unpkg.com/video.js@8.21.0/dist/video.min.js'
  // },
  // {
  //   name: 'xlsx',
  //   var: 'XLSX',
  //   path: 'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js'
  // }
  // {
  //   name: 'echarts',
  //   var: 'echarts',
  //   path: 'https://unpkg.com/echarts@5.4.3/dist/echarts.min.js',
  // },
];
var cdn_config_default = cdnConfigs;

// vite.config.ts
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\wangwenjie\\Desktop\\Study\\react-admin-design";
var cdnConfigsObj = cdn_config_default.reduce(
  (prev, cur) => {
    prev[cur.name] = cur.var;
    return prev;
  },
  { cesium: "Cesium" }
);
var vite_config_default = defineConfig(({ command, mode }) => {
  const root = process.cwd();
  const isBuild = command === "build";
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PORT, VITE_DROP_CONSOLE, VITE_DROP_DEBUGGER } = viteEnv;
  return {
    // 开发环境： 确保本地开发中资源加载正常，通常使用 /。
    // 生产环境： 为了兼容各种部署方式（根目录或子目录），通常使用相对路径 './'。
    // base: isBuild ? './' : '/', // 开发和生产的 base 路径
    base: "/",
    // 如果设置了./(相对路径)会导致子页面访问不到dist/Cesium文件夹
    server: {
      // Listening on all local ips
      host: true,
      open: true,
      port: VITE_PORT
    },
    // define: {
    //   CESIUM_BASE_URL: JSON.stringify(`/Cesium`)
    // },
    plugins: [
      react(),
      webUpdateNotice({
        logVersion: true
      }),
      ViteCdnImport({
        modules: cdn_config_default.map((item) => item)
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), "src/assets/icons")],
        symbolId: "icon-[dir]-[name]"
      }),
      viteMockServe({
        mockPath: "mock",
        ignore: /^_/,
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        injectCode: `
          import { setupProdMockServer } from 'mock/_createProductionServer';

          setupProdMockServer()
          `
      }),
      isBuild && viteExternalsPlugin(cdnConfigsObj)
      // visualizer({
      //   filename: 'state.html',
      //   open: true //如果存在本地服务端口，将在打包后自动展示
      // })
    ].filter(Boolean),
    build: {
      target: "es2015",
      cssTarget: "chrome86",
      minify: "terser",
      assetsInlineLimit: 4096,
      // 小于4KB的资源内联
      // 文件大小限制配置
      chunkSizeWarningLimit: 500,
      // 500kb 警告提示
      terserOptions: {
        compress: {
          keep_infinity: true,
          // used to delete console and debugger in production environment
          drop_console: VITE_DROP_CONSOLE,
          drop_debugger: VITE_DROP_DEBUGGER
        }
      },
      modulePreload: false,
      rollupOptions: {
        //viteExternalsPlugin会自动处理externals,注释掉
        // external: ['react', 'react-dom', 'axios'], // 标记为外部依赖，避免打包到最终输出文件中
        output: {
          // 强制拆分 chunk，使关键文件被标记为 preload
          manualChunks: {
            "vendor-react-dom": ["react-router-dom"],
            // 将 Lodash 库的代码单独打包
            "vendor-lodash": ["lodash-es"],
            // 将组件库的代码打包
            "vendor-antd": ["antd"],
            "vendor-echarts": ["echarts"],
            "vendor-editor": ["@wangeditor/editor"],
            "vendor-handsontable": ["handsontable"],
            "vendor-video": ["video.js"],
            "vendor-xlsx": ["xlsx"]
          }
        },
        treeshake: true
        // 文件大小限制配置
      }
    },
    resolve: {
      alias: {
        "@": resolve(__vite_injected_original_dirname, "./src")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvdXRpbHMudHMiLCAiY2RuLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHdhbmd3ZW5qaWVcXFxcRGVza3RvcFxcXFxTdHVkeVxcXFxyZWFjdC1hZG1pbi1kZXNpZ25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHdhbmd3ZW5qaWVcXFxcRGVza3RvcFxcXFxTdHVkeVxcXFxyZWFjdC1hZG1pbi1kZXNpZ25cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3dhbmd3ZW5qaWUvRGVza3RvcC9TdHVkeS9yZWFjdC1hZG1pbi1kZXNpZ24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgdHlwZSB7IENvbmZpZ0VudiwgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnXG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4taHRtbCdcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xuaW1wb3J0IFZpdGVDZG5JbXBvcnQgZnJvbSAndml0ZS1wbHVnaW4tY2RuLWltcG9ydCdcbmltcG9ydCB7IHZpdGVFeHRlcm5hbHNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1leHRlcm5hbHMnXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xuaW1wb3J0IHsgd2ViVXBkYXRlTm90aWNlIH0gZnJvbSAnQHBsdWdpbi13ZWItdXBkYXRlLW5vdGlmaWNhdGlvbi92aXRlJ1xuaW1wb3J0IHsgd3JhcHBlckVudiB9IGZyb20gJy4vYnVpbGQvdXRpbHMnXG5pbXBvcnQgY2RuQ29uZmlncyBmcm9tICcuL2Nkbi5jb25maWcnXG4vLyBcdTk3MDBcdTg5ODFcdTVCODlcdTg4QzUgQHR5cGluZ3Mvbm9kZSBcdTYzRDJcdTRFRjZcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuY29uc3QgY2RuQ29uZmlnc09iaiA9IGNkbkNvbmZpZ3MucmVkdWNlKFxuICAocHJldjogUmVjb3JkPHN0cmluZywgc3RyaW5nPiwgY3VyKSA9PiB7XG4gICAgcHJldltjdXIubmFtZV0gPSBjdXIudmFyXG4gICAgcmV0dXJuIHByZXZcbiAgfSxcbiAgeyBjZXNpdW06ICdDZXNpdW0nIH1cbilcbi8qKiBAdHlwZSB7aW1wb3J0KCd2aXRlJykuVXNlckNvbmZpZ30gKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH06IENvbmZpZ0Vudik6IFVzZXJDb25maWcgPT4ge1xuICBjb25zdCByb290ID0gcHJvY2Vzcy5jd2QoKVxuICBjb25zdCBpc0J1aWxkID0gY29tbWFuZCA9PT0gJ2J1aWxkJ1xuXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcm9vdClcblxuICAvLyB0aGlzIGZ1bmN0aW9uIGNhbiBiZSBjb252ZXJ0ZWQgdG8gZGlmZmVyZW50IHR5cGluZ3NcbiAgY29uc3Qgdml0ZUVudjogYW55ID0gd3JhcHBlckVudihlbnYpXG4gIGNvbnN0IHsgVklURV9QT1JULCBWSVRFX0RST1BfQ09OU09MRSwgVklURV9EUk9QX0RFQlVHR0VSIH0gPSB2aXRlRW52XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdUZGMUEgXHU3ODZFXHU0RkREXHU2NzJDXHU1NzMwXHU1RjAwXHU1M0QxXHU0RTJEXHU4RDQ0XHU2RTkwXHU1MkEwXHU4RjdEXHU2QjYzXHU1RTM4XHVGRjBDXHU5MDFBXHU1RTM4XHU0RjdGXHU3NTI4IC9cdTMwMDJcbiAgICAvLyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdUZGMUEgXHU0RTNBXHU0RTg2XHU1MTdDXHU1QkI5XHU1NDA0XHU3OUNEXHU5MEU4XHU3RjcyXHU2NUI5XHU1RjBGXHVGRjA4XHU2ODM5XHU3NkVFXHU1RjU1XHU2MjE2XHU1QjUwXHU3NkVFXHU1RjU1XHVGRjA5XHVGRjBDXHU5MDFBXHU1RTM4XHU0RjdGXHU3NTI4XHU3NkY4XHU1QkY5XHU4REVGXHU1Rjg0ICcuLydcdTMwMDJcbiAgICAvLyBiYXNlOiBpc0J1aWxkID8gJy4vJyA6ICcvJywgLy8gXHU1RjAwXHU1M0QxXHU1NDhDXHU3NTFGXHU0RUE3XHU3Njg0IGJhc2UgXHU4REVGXHU1Rjg0XG4gICAgYmFzZTogJy8nLCAvLyBcdTU5ODJcdTY3OUNcdThCQkVcdTdGNkVcdTRFODYuLyhcdTc2RjhcdTVCRjlcdThERUZcdTVGODQpXHU0RjFBXHU1QkZDXHU4MUY0XHU1QjUwXHU5ODc1XHU5NzYyXHU4QkJGXHU5NUVFXHU0RTBEXHU1MjMwZGlzdC9DZXNpdW1cdTY1ODdcdTRFRjZcdTU5MzlcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIC8vIExpc3RlbmluZyBvbiBhbGwgbG9jYWwgaXBzXG4gICAgICBob3N0OiB0cnVlLFxuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIHBvcnQ6IFZJVEVfUE9SVFxuICAgIH0sXG4gICAgLy8gZGVmaW5lOiB7XG4gICAgLy8gICBDRVNJVU1fQkFTRV9VUkw6IEpTT04uc3RyaW5naWZ5KGAvQ2VzaXVtYClcbiAgICAvLyB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICB3ZWJVcGRhdGVOb3RpY2Uoe1xuICAgICAgICBsb2dWZXJzaW9uOiB0cnVlXG4gICAgICB9KSxcbiAgICAgIFZpdGVDZG5JbXBvcnQoe1xuICAgICAgICBtb2R1bGVzOiBjZG5Db25maWdzLm1hcChpdGVtID0+IGl0ZW0pXG4gICAgICB9KSxcbiAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcbiAgICAgICAgaWNvbkRpcnM6IFtyZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMvYXNzZXRzL2ljb25zJyldLFxuICAgICAgICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJ1xuICAgICAgfSksXG4gICAgICB2aXRlTW9ja1NlcnZlKHtcbiAgICAgICAgbW9ja1BhdGg6ICdtb2NrJyxcbiAgICAgICAgaWdub3JlOiAvXl8vLFxuICAgICAgICBsb2NhbEVuYWJsZWQ6ICFpc0J1aWxkLFxuICAgICAgICBwcm9kRW5hYmxlZDogaXNCdWlsZCxcbiAgICAgICAgaW5qZWN0Q29kZTogYFxuICAgICAgICAgIGltcG9ydCB7IHNldHVwUHJvZE1vY2tTZXJ2ZXIgfSBmcm9tICdtb2NrL19jcmVhdGVQcm9kdWN0aW9uU2VydmVyJztcblxuICAgICAgICAgIHNldHVwUHJvZE1vY2tTZXJ2ZXIoKVxuICAgICAgICAgIGBcbiAgICAgIH0pLFxuICAgICAgaXNCdWlsZCAmJiB2aXRlRXh0ZXJuYWxzUGx1Z2luKGNkbkNvbmZpZ3NPYmopXG4gICAgICAvLyB2aXN1YWxpemVyKHtcbiAgICAgIC8vICAgZmlsZW5hbWU6ICdzdGF0ZS5odG1sJyxcbiAgICAgIC8vICAgb3BlbjogdHJ1ZSAvL1x1NTk4Mlx1Njc5Q1x1NUI1OFx1NTcyOFx1NjcyQ1x1NTczMFx1NjcwRFx1NTJBMVx1N0FFRlx1NTNFM1x1RkYwQ1x1NUMwNlx1NTcyOFx1NjI1M1x1NTMwNVx1NTQwRVx1ODFFQVx1NTJBOFx1NUM1NVx1NzkzQVxuICAgICAgLy8gfSlcbiAgICBdLmZpbHRlcihCb29sZWFuKSxcbiAgICBidWlsZDoge1xuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICAgIGNzc1RhcmdldDogJ2Nocm9tZTg2JyxcbiAgICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NiwgLy8gXHU1QzBGXHU0RThFNEtCXHU3Njg0XHU4RDQ0XHU2RTkwXHU1MTg1XHU4MDU0XG4gICAgICAvLyBcdTY1ODdcdTRFRjZcdTU5MjdcdTVDMEZcdTk2NTBcdTUyMzZcdTkxNERcdTdGNkVcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogNTAwLCAvLyA1MDBrYiBcdThCNjZcdTU0NEFcdTYzRDBcdTc5M0FcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBrZWVwX2luZmluaXR5OiB0cnVlLFxuICAgICAgICAgIC8vIHVzZWQgdG8gZGVsZXRlIGNvbnNvbGUgYW5kIGRlYnVnZ2VyIGluIHByb2R1Y3Rpb24gZW52aXJvbm1lbnRcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IFZJVEVfRFJPUF9DT05TT0xFLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IFZJVEVfRFJPUF9ERUJVR0dFUlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgbW9kdWxlUHJlbG9hZDogZmFsc2UsXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIC8vdml0ZUV4dGVybmFsc1BsdWdpblx1NEYxQVx1ODFFQVx1NTJBOFx1NTkwNFx1NzQwNmV4dGVybmFscyxcdTZDRThcdTkxQ0FcdTYzODlcbiAgICAgICAgLy8gZXh0ZXJuYWw6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ2F4aW9zJ10sIC8vIFx1NjgwN1x1OEJCMFx1NEUzQVx1NTkxNlx1OTBFOFx1NEY5RFx1OEQ1Nlx1RkYwQ1x1OTA3Rlx1NTE0RFx1NjI1M1x1NTMwNVx1NTIzMFx1NjcwMFx1N0VDOFx1OEY5M1x1NTFGQVx1NjU4N1x1NEVGNlx1NEUyRFxuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAvLyBcdTVGM0FcdTUyMzZcdTYyQzZcdTUyMDYgY2h1bmtcdUZGMENcdTRGN0ZcdTUxNzNcdTk1MkVcdTY1ODdcdTRFRjZcdTg4QUJcdTY4MDdcdThCQjBcdTRFM0EgcHJlbG9hZFxuICAgICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICAgJ3ZlbmRvci1yZWFjdC1kb20nOiBbJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICAgIC8vIFx1NUMwNiBMb2Rhc2ggXHU1RTkzXHU3Njg0XHU0RUUzXHU3ODAxXHU1MzU1XHU3MkVDXHU2MjUzXHU1MzA1XG4gICAgICAgICAgICAndmVuZG9yLWxvZGFzaCc6IFsnbG9kYXNoLWVzJ10sXG4gICAgICAgICAgICAvLyBcdTVDMDZcdTdFQzRcdTRFRjZcdTVFOTNcdTc2ODRcdTRFRTNcdTc4MDFcdTYyNTNcdTUzMDVcbiAgICAgICAgICAgICd2ZW5kb3ItYW50ZCc6IFsnYW50ZCddLFxuICAgICAgICAgICAgJ3ZlbmRvci1lY2hhcnRzJzogWydlY2hhcnRzJ10sXG4gICAgICAgICAgICAndmVuZG9yLWVkaXRvcic6IFsnQHdhbmdlZGl0b3IvZWRpdG9yJ10sXG4gICAgICAgICAgICAndmVuZG9yLWhhbmRzb250YWJsZSc6IFsnaGFuZHNvbnRhYmxlJ10sXG4gICAgICAgICAgICAndmVuZG9yLXZpZGVvJzogWyd2aWRlby5qcyddLFxuICAgICAgICAgICAgJ3ZlbmRvci14bHN4JzogWyd4bHN4J11cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHRyZWVzaGFrZTogdHJ1ZVxuICAgICAgICAvLyBcdTY1ODdcdTRFRjZcdTU5MjdcdTVDMEZcdTk2NTBcdTUyMzZcdTkxNERcdTdGNkVcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpXG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx3YW5nd2VuamllXFxcXERlc2t0b3BcXFxcU3R1ZHlcXFxccmVhY3QtYWRtaW4tZGVzaWduXFxcXGJ1aWxkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx3YW5nd2VuamllXFxcXERlc2t0b3BcXFxcU3R1ZHlcXFxccmVhY3QtYWRtaW4tZGVzaWduXFxcXGJ1aWxkXFxcXHV0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy93YW5nd2VuamllL0Rlc2t0b3AvU3R1ZHkvcmVhY3QtYWRtaW4tZGVzaWduL2J1aWxkL3V0aWxzLnRzXCI7ZGVjbGFyZSB0eXBlIFJlY29yZGFibGU8VCA9IGFueT4gPSBSZWNvcmQ8c3RyaW5nLCBUPlxuXG5pbnRlcmZhY2UgVml0ZUVudiB7XG4gIFZJVEVfUE9SVDogbnVtYmVyXG4gIFZJVEVfUFJPWFk6IFtzdHJpbmcsIHN0cmluZ11bXVxuICBWSVRFX0RST1BfQ09OU09MRTogYm9vbGVhblxuICBWSVRFX0RST1BfREVCVUdHRVI6IGJvb2xlYW5cbn1cblxuLy8gcmVhZCBhbGwgZW52aXJvbm1lbnQgdmFyaWFibGUgY29uZmlndXJhdGlvbiBmaWxlcyB0byBwcm9jZXNzLmVudlxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBwZXJFbnYoZW52Q29uZjogUmVjb3JkYWJsZSk6IFZpdGVFbnYge1xuICBjb25zdCByZXN1bHQ6IGFueSA9IHt9XG5cbiAgZm9yIChjb25zdCBlbnZOYW1lIG9mIE9iamVjdC5rZXlzKGVudkNvbmYpKSB7XG4gICAgbGV0IHJlYWxOYW1lID0gZW52Q29uZltlbnZOYW1lXS5yZXBsYWNlKC9cXFxcbi9nLCAnXFxuJylcbiAgICByZWFsTmFtZSA9IHJlYWxOYW1lID09PSAndHJ1ZScgPyB0cnVlIDogcmVhbE5hbWUgPT09ICdmYWxzZScgPyBmYWxzZSA6IHJlYWxOYW1lXG5cbiAgICBpZiAoZW52TmFtZSA9PT0gJ1ZJVEVfUE9SVCcpIHtcbiAgICAgIHJlYWxOYW1lID0gTnVtYmVyKHJlYWxOYW1lKVxuICAgIH1cblxuICAgIGlmIChlbnZOYW1lID09PSAnVklURV9QUk9YWScgJiYgcmVhbE5hbWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlYWxOYW1lID0gSlNPTi5wYXJzZShyZWFsTmFtZS5yZXBsYWNlKC8nL2csICdcIicpKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVhbE5hbWUgPSAnJ1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdFtlbnZOYW1lXSA9IHJlYWxOYW1lXG5cbiAgICBpZiAodHlwZW9mIHJlYWxOYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgcHJvY2Vzcy5lbnZbZW52TmFtZV0gPSByZWFsTmFtZVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlYWxOYW1lID09PSAnb2JqZWN0Jykge1xuICAgICAgcHJvY2Vzcy5lbnZbZW52TmFtZV0gPSBKU09OLnN0cmluZ2lmeShyZWFsTmFtZSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHdhbmd3ZW5qaWVcXFxcRGVza3RvcFxcXFxTdHVkeVxcXFxyZWFjdC1hZG1pbi1kZXNpZ25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHdhbmd3ZW5qaWVcXFxcRGVza3RvcFxcXFxTdHVkeVxcXFxyZWFjdC1hZG1pbi1kZXNpZ25cXFxcY2RuLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvd2FuZ3dlbmppZS9EZXNrdG9wL1N0dWR5L3JlYWN0LWFkbWluLWRlc2lnbi9jZG4uY29uZmlnLnRzXCI7aW50ZXJmYWNlIGNkbkNvbmZpZyB7XG4gIG5hbWU6IHN0cmluZ1xuICB2YXI6IHN0cmluZ1xuICBwYXRoOiBzdHJpbmdcbn1cbmNvbnN0IGNkbkNvbmZpZ3MgPSBbXG4gIHtcbiAgICBuYW1lOiAncmVhY3QnLFxuICAgIHZhcjogJ1JlYWN0JyxcbiAgICBwYXRoOiAnaHR0cHM6Ly91bnBrZy5jb20vcmVhY3RAMTguMy4xL3VtZC9yZWFjdC5wcm9kdWN0aW9uLm1pbi5qcydcbiAgfSxcbiAge1xuICAgIG5hbWU6ICdyZWFjdC1kb20nLFxuICAgIHZhcjogJ1JlYWN0RE9NJyxcbiAgICBwYXRoOiAnaHR0cHM6Ly91bnBrZy5jb20vcmVhY3QtZG9tQDE4LjMuMS91bWQvcmVhY3QtZG9tLnByb2R1Y3Rpb24ubWluLmpzJ1xuICB9LFxuICB7XG4gICAgbmFtZTogJ2F4aW9zJyxcbiAgICB2YXI6ICdheGlvcycsXG4gICAgcGF0aDogJ2h0dHBzOi8vdW5wa2cuY29tL2F4aW9zQDEuNi4yL2Rpc3QvYXhpb3MubWluLmpzJ1xuICB9XG4gIC8vIHtcbiAgLy8gICBuYW1lOiAndmlkZW8uanMnLFxuICAvLyAgIHZhcjogJ3ZpZGVvanMnLFxuICAvLyAgIHBhdGg6ICdodHRwczovL3VucGtnLmNvbS92aWRlby5qc0A4LjIxLjAvZGlzdC92aWRlby5taW4uanMnXG4gIC8vIH0sXG4gIC8vIHtcbiAgLy8gICBuYW1lOiAneGxzeCcsXG4gIC8vICAgdmFyOiAnWExTWCcsXG4gIC8vICAgcGF0aDogJ2h0dHBzOi8vdW5wa2cuY29tL3hsc3hAMC4xOC41L2Rpc3QveGxzeC5mdWxsLm1pbi5qcydcbiAgLy8gfVxuICAvLyB7XG4gIC8vICAgbmFtZTogJ2VjaGFydHMnLFxuICAvLyAgIHZhcjogJ2VjaGFydHMnLFxuICAvLyAgIHBhdGg6ICdodHRwczovL3VucGtnLmNvbS9lY2hhcnRzQDUuNC4zL2Rpc3QvZWNoYXJ0cy5taW4uanMnLFxuICAvLyB9LFxuXVxuZXhwb3J0IGRlZmF1bHQgY2RuQ29uZmlnc1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLE9BQU8s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
