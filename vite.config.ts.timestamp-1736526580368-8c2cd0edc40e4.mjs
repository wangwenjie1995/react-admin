// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/wangwenjie/Desktop/Study/react-admin-design/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/wangwenjie/Desktop/Study/react-admin-design/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///C:/Users/wangwenjie/Desktop/Study/react-admin-design/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import { viteMockServe } from "file:///C:/Users/wangwenjie/Desktop/Study/react-admin-design/node_modules/vite-plugin-mock/dist/index.js";

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

// vite.config.ts
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\wangwenjie\\Desktop\\Study\\react-admin-design";
var vite_config_default = defineConfig(({ command, mode }) => {
  const root = process.cwd();
  const isBuild = command === "build";
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PORT, VITE_DROP_CONSOLE } = viteEnv;
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
    plugins: [
      react(),
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
      })
    ],
    build: {
      target: "es2015",
      cssTarget: "chrome86",
      minify: "terser",
      terserOptions: {
        compress: {
          keep_infinity: true,
          // used to delete console and debugger in production environment
          drop_console: VITE_DROP_CONSOLE
        }
      },
      chunkSizeWarningLimit: 2e3
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvdXRpbHMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx3YW5nd2VuamllXFxcXERlc2t0b3BcXFxcU3R1ZHlcXFxccmVhY3QtYWRtaW4tZGVzaWduXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx3YW5nd2VuamllXFxcXERlc2t0b3BcXFxcU3R1ZHlcXFxccmVhY3QtYWRtaW4tZGVzaWduXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy93YW5nd2VuamllL0Rlc2t0b3AvU3R1ZHkvcmVhY3QtYWRtaW4tZGVzaWduL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHR5cGUgeyBDb25maWdFbnYsIFVzZXJDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4tc3ZnLWljb25zJ1xuaW1wb3J0IHsgdml0ZU1vY2tTZXJ2ZSB9IGZyb20gJ3ZpdGUtcGx1Z2luLW1vY2snXG5pbXBvcnQgeyB3cmFwcGVyRW52IH0gZnJvbSAnLi9idWlsZC91dGlscydcbi8vIFx1OTcwMFx1ODk4MVx1NUI4OVx1ODhDNSBAdHlwaW5ncy9ub2RlIFx1NjNEMlx1NEVGNlxuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG4vKiogQHR5cGUge2ltcG9ydCgndml0ZScpLlVzZXJDb25maWd9ICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9OiBDb25maWdFbnYpOiBVc2VyQ29uZmlnID0+IHtcbiAgY29uc3Qgcm9vdCA9IHByb2Nlc3MuY3dkKClcbiAgY29uc3QgaXNCdWlsZCA9IGNvbW1hbmQgPT09ICdidWlsZCdcblxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHJvb3QpXG5cbiAgLy8gdGhpcyBmdW5jdGlvbiBjYW4gYmUgY29udmVydGVkIHRvIGRpZmZlcmVudCB0eXBpbmdzXG4gIGNvbnN0IHZpdGVFbnY6IGFueSA9IHdyYXBwZXJFbnYoZW52KVxuICBjb25zdCB7IFZJVEVfUE9SVCwgVklURV9EUk9QX0NPTlNPTEUgfSA9IHZpdGVFbnZcblxuICByZXR1cm4ge1xuICAgIC8vIFx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1RkYxQSBcdTc4NkVcdTRGRERcdTY3MkNcdTU3MzBcdTVGMDBcdTUzRDFcdTRFMkRcdThENDRcdTZFOTBcdTUyQTBcdThGN0RcdTZCNjNcdTVFMzhcdUZGMENcdTkwMUFcdTVFMzhcdTRGN0ZcdTc1MjggL1x1MzAwMlxuICAgIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1RkYxQSBcdTRFM0FcdTRFODZcdTUxN0NcdTVCQjlcdTU0MDRcdTc5Q0RcdTkwRThcdTdGNzJcdTY1QjlcdTVGMEZcdUZGMDhcdTY4MzlcdTc2RUVcdTVGNTVcdTYyMTZcdTVCNTBcdTc2RUVcdTVGNTVcdUZGMDlcdUZGMENcdTkwMUFcdTVFMzhcdTRGN0ZcdTc1MjhcdTc2RjhcdTVCRjlcdThERUZcdTVGODQgJy4vJ1x1MzAwMlxuICAgIC8vIGJhc2U6IGlzQnVpbGQgPyAnLi8nIDogJy8nLCAvLyBcdTVGMDBcdTUzRDFcdTU0OENcdTc1MUZcdTRFQTdcdTc2ODQgYmFzZSBcdThERUZcdTVGODRcbiAgICBiYXNlOiAnLycsIC8vIFx1NTk4Mlx1Njc5Q1x1OEJCRVx1N0Y2RVx1NEU4Ni4vKFx1NzZGOFx1NUJGOVx1OERFRlx1NUY4NClcdTRGMUFcdTVCRkNcdTgxRjRcdTVCNTBcdTk4NzVcdTk3NjJcdThCQkZcdTk1RUVcdTRFMERcdTUyMzBkaXN0L0Nlc2l1bVx1NjU4N1x1NEVGNlx1NTkzOVxuICAgIHNlcnZlcjoge1xuICAgICAgLy8gTGlzdGVuaW5nIG9uIGFsbCBsb2NhbCBpcHNcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgICBvcGVuOiB0cnVlLFxuICAgICAgcG9ydDogVklURV9QT1JUXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCgpLFxuICAgICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgICAgICBpY29uRGlyczogW3Jlc29sdmUocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hc3NldHMvaWNvbnMnKV0sXG4gICAgICAgIHN5bWJvbElkOiAnaWNvbi1bZGlyXS1bbmFtZV0nXG4gICAgICB9KSxcbiAgICAgIHZpdGVNb2NrU2VydmUoe1xuICAgICAgICBtb2NrUGF0aDogJ21vY2snLFxuICAgICAgICBpZ25vcmU6IC9eXy8sXG4gICAgICAgIGxvY2FsRW5hYmxlZDogIWlzQnVpbGQsXG4gICAgICAgIHByb2RFbmFibGVkOiBpc0J1aWxkLFxuICAgICAgICBpbmplY3RDb2RlOiBgXG4gICAgICAgICAgaW1wb3J0IHsgc2V0dXBQcm9kTW9ja1NlcnZlciB9IGZyb20gJ21vY2svX2NyZWF0ZVByb2R1Y3Rpb25TZXJ2ZXInO1xuXG4gICAgICAgICAgc2V0dXBQcm9kTW9ja1NlcnZlcigpXG4gICAgICAgICAgYFxuICAgICAgfSlcbiAgICBdLFxuXG4gICAgYnVpbGQ6IHtcbiAgICAgIHRhcmdldDogJ2VzMjAxNScsXG4gICAgICBjc3NUYXJnZXQ6ICdjaHJvbWU4NicsXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgIGtlZXBfaW5maW5pdHk6IHRydWUsXG4gICAgICAgICAgLy8gdXNlZCB0byBkZWxldGUgY29uc29sZSBhbmQgZGVidWdnZXIgaW4gcHJvZHVjdGlvbiBlbnZpcm9ubWVudFxuICAgICAgICAgIGRyb3BfY29uc29sZTogVklURV9EUk9QX0NPTlNPTEVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMjAwMFxuICAgIH0sXG5cbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pXG5cblxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx3YW5nd2VuamllXFxcXERlc2t0b3BcXFxcU3R1ZHlcXFxccmVhY3QtYWRtaW4tZGVzaWduXFxcXGJ1aWxkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx3YW5nd2VuamllXFxcXERlc2t0b3BcXFxcU3R1ZHlcXFxccmVhY3QtYWRtaW4tZGVzaWduXFxcXGJ1aWxkXFxcXHV0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy93YW5nd2VuamllL0Rlc2t0b3AvU3R1ZHkvcmVhY3QtYWRtaW4tZGVzaWduL2J1aWxkL3V0aWxzLnRzXCI7ZGVjbGFyZSB0eXBlIFJlY29yZGFibGU8VCA9IGFueT4gPSBSZWNvcmQ8c3RyaW5nLCBUPlxyXG5cclxuaW50ZXJmYWNlIFZpdGVFbnYge1xyXG4gIFZJVEVfUE9SVDogbnVtYmVyXHJcbiAgVklURV9QUk9YWTogW3N0cmluZywgc3RyaW5nXVtdXHJcbiAgVklURV9EUk9QX0NPTlNPTEU6IGJvb2xlYW5cclxufVxyXG5cclxuLy8gcmVhZCBhbGwgZW52aXJvbm1lbnQgdmFyaWFibGUgY29uZmlndXJhdGlvbiBmaWxlcyB0byBwcm9jZXNzLmVudlxyXG5leHBvcnQgZnVuY3Rpb24gd3JhcHBlckVudihlbnZDb25mOiBSZWNvcmRhYmxlKTogVml0ZUVudiB7XHJcbiAgY29uc3QgcmVzdWx0OiBhbnkgPSB7fVxyXG5cclxuICBmb3IgKGNvbnN0IGVudk5hbWUgb2YgT2JqZWN0LmtleXMoZW52Q29uZikpIHtcclxuICAgIGxldCByZWFsTmFtZSA9IGVudkNvbmZbZW52TmFtZV0ucmVwbGFjZSgvXFxcXG4vZywgJ1xcbicpXHJcbiAgICByZWFsTmFtZSA9IHJlYWxOYW1lID09PSAndHJ1ZScgPyB0cnVlIDogcmVhbE5hbWUgPT09ICdmYWxzZScgPyBmYWxzZSA6IHJlYWxOYW1lXHJcblxyXG4gICAgaWYgKGVudk5hbWUgPT09ICdWSVRFX1BPUlQnKSB7XHJcbiAgICAgIHJlYWxOYW1lID0gTnVtYmVyKHJlYWxOYW1lKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChlbnZOYW1lID09PSAnVklURV9QUk9YWScgJiYgcmVhbE5hbWUpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICByZWFsTmFtZSA9IEpTT04ucGFyc2UocmVhbE5hbWUucmVwbGFjZSgvJy9nLCAnXCInKSlcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZWFsTmFtZSA9ICcnXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXN1bHRbZW52TmFtZV0gPSByZWFsTmFtZVxyXG5cclxuICAgIGlmICh0eXBlb2YgcmVhbE5hbWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHByb2Nlc3MuZW52W2Vudk5hbWVdID0gcmVhbE5hbWVcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHJlYWxOYW1lID09PSAnb2JqZWN0Jykge1xyXG4gICAgICBwcm9jZXNzLmVudltlbnZOYW1lXSA9IEpTT04uc3RyaW5naWZ5KHJlYWxOYW1lKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJlc3VsdFxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFdBQVc7QUFDbEIsU0FBUyw0QkFBNEI7QUFDckMsU0FBUyxxQkFBcUI7OztBQ0t2QixTQUFTLFdBQVcsU0FBOEI7QUFDdkQsUUFBTSxTQUFjLENBQUM7QUFFckIsYUFBVyxXQUFXLE9BQU8sS0FBSyxPQUFPLEdBQUc7QUFDMUMsUUFBSSxXQUFXLFFBQVEsT0FBTyxFQUFFLFFBQVEsUUFBUSxJQUFJO0FBQ3BELGVBQVcsYUFBYSxTQUFTLE9BQU8sYUFBYSxVQUFVLFFBQVE7QUFFdkUsUUFBSSxZQUFZLGFBQWE7QUFDM0IsaUJBQVcsT0FBTyxRQUFRO0FBQUEsSUFDNUI7QUFFQSxRQUFJLFlBQVksZ0JBQWdCLFVBQVU7QUFDeEMsVUFBSTtBQUNGLG1CQUFXLEtBQUssTUFBTSxTQUFTLFFBQVEsTUFBTSxHQUFHLENBQUM7QUFBQSxNQUNuRCxTQUFTLE9BQU87QUFDZCxtQkFBVztBQUFBLE1BQ2I7QUFBQSxJQUNGO0FBRUEsV0FBTyxPQUFPLElBQUk7QUFFbEIsUUFBSSxPQUFPLGFBQWEsVUFBVTtBQUNoQyxjQUFRLElBQUksT0FBTyxJQUFJO0FBQUEsSUFDekIsV0FBVyxPQUFPLGFBQWEsVUFBVTtBQUN2QyxjQUFRLElBQUksT0FBTyxJQUFJLEtBQUssVUFBVSxRQUFRO0FBQUEsSUFDaEQ7QUFBQSxFQUNGO0FBRUEsU0FBTztBQUNUOzs7QUQvQkEsU0FBUyxlQUFlO0FBUHhCLElBQU0sbUNBQW1DO0FBU3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQTZCO0FBQ3hFLFFBQU0sT0FBTyxRQUFRLElBQUk7QUFDekIsUUFBTSxVQUFVLFlBQVk7QUFFNUIsUUFBTSxNQUFNLFFBQVEsTUFBTSxJQUFJO0FBRzlCLFFBQU0sVUFBZSxXQUFXLEdBQUc7QUFDbkMsUUFBTSxFQUFFLFdBQVcsa0JBQWtCLElBQUk7QUFFekMsU0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBLElBSUwsTUFBTTtBQUFBO0FBQUEsSUFDTixRQUFRO0FBQUE7QUFBQSxNQUVOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixxQkFBcUI7QUFBQSxRQUNuQixVQUFVLENBQUMsUUFBUSxRQUFRLElBQUksR0FBRyxrQkFBa0IsQ0FBQztBQUFBLFFBQ3JELFVBQVU7QUFBQSxNQUNaLENBQUM7QUFBQSxNQUNELGNBQWM7QUFBQSxRQUNaLFVBQVU7QUFBQSxRQUNWLFFBQVE7QUFBQSxRQUNSLGNBQWMsQ0FBQztBQUFBLFFBQ2YsYUFBYTtBQUFBLFFBQ2IsWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLZCxDQUFDO0FBQUEsSUFDSDtBQUFBLElBRUEsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFVBQ1IsZUFBZTtBQUFBO0FBQUEsVUFFZixjQUFjO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsTUFDQSx1QkFBdUI7QUFBQSxJQUN6QjtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNqQztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
