import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// component module page
const ThreeJsRoute: RouteObject = {
  path: '/threeJs',
  name: 'ThreeJs',
  element: <LayoutGuard />,
  meta: {
    title: 'ThreeJs',
    icon: 'threeJs',
    orderNo: 6
  },
  children: [
    {
      path: 'gobang',
      name: 'Gobang',
      element: LazyLoad(lazy(() => import('@/views/gobang3D'))),
      meta: {
        title: 'Gobang',
        key: 'gobang'
      }
    },
  ]
}

export default ThreeJsRoute

