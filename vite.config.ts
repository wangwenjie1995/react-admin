import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import { wrapperEnv } from './build/utils'
// 需要安装 @typings/node 插件
import { resolve } from 'path'

const cesiumSource = "node_modules/cesium/Build/Cesium";
// This is the base url for static files that CesiumJS needs to load.
// Set to an empty string to place the files at the site's root path
const cesiumBaseUrl = "cesiumStatic";
/** @type {import('vite').UserConfig} */
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const isBuild = command === 'build'

  const env = loadEnv(mode, root)

  // this function can be converted to different typings
  const viteEnv: any = wrapperEnv(env)
  const { VITE_PORT, VITE_DROP_CONSOLE } = viteEnv

  return {
    // 开发环境： 确保本地开发中资源加载正常，通常使用 /。
    // 生产环境： 为了兼容各种部署方式（根目录或子目录），通常使用相对路径 './'。
    base: isBuild ? './' : '/', // 开发和生产的 base 路径
    server: {
      // Listening on all local ips
      host: true,
      open: true,
      port: VITE_PORT
    },
    define: {
      // Define relative base path in cesium for loading assets
      // https://vitejs.dev/config/shared-options.html#define
      CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`),
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          { src: `${cesiumSource}/ThirdParty`, dest: cesiumBaseUrl },
          { src: `${cesiumSource}/Workers`, dest: cesiumBaseUrl },
          { src: `${cesiumSource}/Assets`, dest: cesiumBaseUrl },
          { src: `${cesiumSource}/Widgets`, dest: cesiumBaseUrl },
        ],
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),
      viteMockServe({
        mockPath: 'mock',
        ignore: /^_/,
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        injectCode: `
          import { setupProdMockServer } from 'mock/_createProductionServer';

          setupProdMockServer()
          `
      })
    ],

    build: {
      target: 'es2015',
      cssTarget: 'chrome86',
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          // used to delete console and debugger in production environment
          drop_console: VITE_DROP_CONSOLE
        }
      },
      chunkSizeWarningLimit: 2000
    },

    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    }
  }
})


