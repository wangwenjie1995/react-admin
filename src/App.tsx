import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { ConfigProvider } from 'antd'
import { setupProdMockServer } from '../mock/_createProductionServer'
import useLanguage from './hooks/web/language'
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';

function App() {
  const isBuild = process.env.NODE_ENV === 'production'
  const { locale } = useLanguage()
  if (isBuild) {
    setupProdMockServer()
  }

  return (
    <ConfigProvider
      locale={locale}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App
