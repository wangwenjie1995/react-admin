import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// component module page
const CompoRoute: RouteObject = {
  path: '/pdf',
  name: 'Pdf',
  element: <LayoutGuard />,
  meta: {
    title: 'PDF',
    icon: 'pdf',
    orderNo: 6
  },
  children: [
    {
      path: 'single-pdf',
      name: 'SinglePdf',
      element: LazyLoad(lazy(() => import('@/views/compo/pdfDemo'))),
      meta: {
        title: '单页切换/渲染',
        key: 'singlePdf'
      }
    },
    {
      path: 'all-pdf',
      name: 'AllPdf',
      element: LazyLoad(lazy(() => import('@/views/compo/pdfDemo2'))),
      meta: {
        title: '渲染全部',
        key: 'allPdf'
      }
    }
  ]
}

export default CompoRoute
