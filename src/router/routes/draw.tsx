import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// component module page
const DrawRoute: RouteObject = {
  path: '/draw',
  name: 'Draw',
  element: <LayoutGuard />,
  meta: {
    title: '图画',
    icon: 'draw',
    orderNo: 6
  },
  children: [
    {
      path: 'canvas-draw',
      name: 'CanvasDraw',
      element: LazyLoad(lazy(() => import('@/views/draw/canvasDraw'))),
      meta: {
        title: 'canvas画图',
        key: 'canvas'
      }
    },
  ]
}

export default DrawRoute

