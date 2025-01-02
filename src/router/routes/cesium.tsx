import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'

// component module page
const DrawRoute: RouteObject = {
  path: '/cesium',
  name: 'Cesium',
  element: <LayoutGuard />,
  meta: {
    title: 'Cesium',
    icon: 'draw',
    orderNo: 6
  },
  children: [
    {
      path: 'cesium-map',
      name: 'CesiumMap',
      element: LazyLoad(lazy(() => import('@/views/cesium'))),
      meta: {
        title: 'CesiumMap',
        key: 'cesiumMap'
      }
    },
  ]
}

export default DrawRoute

