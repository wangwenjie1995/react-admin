import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteMockServe } from 'vite-plugin-mock'
import ViteCdnImport from 'vite-plugin-cdn-import'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import { visualizer } from 'rollup-plugin-visualizer'
import { wrapperEnv } from './build/utils'
import cdnConfigs from './cdn.config'
// 需要安装 @typings/node 插件
import { resolve } from 'path'
const cdnConfigsObj = cdnConfigs.reduce(
  (prev: Record<string, string>, cur) => {
    prev[cur.name] = cur.var
    return prev
  },
  { cesium: 'Cesium' }
)
/** @type {import('vite').UserConfig} */
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const isBuild = command === 'build'

  const env = loadEnv(mode, root)

  // this function can be converted to different typings
  const viteEnv: any = wrapperEnv(env)
  const { VITE_PORT, VITE_DROP_CONSOLE, VITE_DROP_DEBUGGER } = viteEnv

  return {
    // 开发环境： 确保本地开发中资源加载正常，通常使用 /。
    // 生产环境： 为了兼容各种部署方式（根目录或子目录），通常使用相对路径 './'。
    // base: isBuild ? './' : '/', // 开发和生产的 base 路径
    base: '/', // 如果设置了./(相对路径)会导致子页面访问不到dist/Cesium文件夹
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
      ViteCdnImport({
        modules: cdnConfigs.map(item => item)
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
      }),
      isBuild && viteExternalsPlugin(cdnConfigsObj),
      visualizer({
        filename: 'state.html',
        open: true //如果存在本地服务端口，将在打包后自动展示
      })
    ].filter(Boolean),
    build: {
      target: 'es2015',
      cssTarget: 'chrome86',
      minify: 'terser',
      assetsInlineLimit: 4096, // 小于4KB的资源内联
      // 文件大小限制配置
      chunkSizeWarningLimit: 500, // 500kb 警告提示
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
            'vendor-react-dom': ['react-router-dom'],
            // 将 Lodash 库的代码单独打包
            'vendor-lodash': ['lodash-es'],
            // 将组件库的代码打包
            'vendor-antd': ['antd'],
            'vendor-echarts': ['echarts'],
            'vendor-editor': ['@wangeditor/editor'],
            'vendor-handsontable': ['handsontable'],
            'vendor-video': ['video.js'],
            'vendor-xlsx': ['xlsx']
          }
        },
        treeshake: true
        // 文件大小限制配置
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    }
  }
})
