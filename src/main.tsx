import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@/design/index.less'
import '@/language'
// 配置 Cesium 静态资源的基路径
(window as any).CESIUM_BASE_URL = "/Cesium";

// register svg icon
import 'virtual:svg-icons-register'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
