import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAuthCache } from '@/utils/auth'
import { TOKEN_KEY } from '@/enums/cacheEnum'
import { useAppSelector } from '@/stores'
import { Permission } from '@/stores/types'
const checkAutn = (permissions: Permission[], path: string): boolean => {
  for (const permission of permissions) {
    //首先检查父级路径
    if (permission.path === path) {
      return true;
    }

    //如果有子权限,需要确保子权限的路径匹配正确
    if (permission.children && permission.children.length) {
      //递归检查子节点
      for (const child of permission.children) {
        const fullPath = permission.path + child.path
        console.log(fullPath, path)
        if (fullPath === path) {
          return true
        }
        //继续递归检查子级的子集

        if (checkAutn([child], path)) {
          return true;
        }
      }
    }
  }
  return false
}
export const GuardRoute = ({ children }: { children: ReactNode }) => {
  const whiteList: string[] = ['/', '/home', '/login']
  const { pathname } = useLocation()
  const { token, permissions } = useAppSelector(state => state.user)
  const getToken = (): string => {
    return token || getAuthCache<string>(TOKEN_KEY)
  }

  if (!getToken()) {
    if (whiteList.includes(pathname)) {
      return <Navigate to='/login' replace />
    } else {
      return <Navigate to={`/login?redirect=${pathname}`} replace />
    }
  }
  // 如果有 token，检查权限
  console.log(pathname, permissions)
  if (!checkAutn(permissions, pathname)) {
    // 如果没有权限，跳转到 403 页面或其他权限不足页面
    return <Navigate to="/403" replace />;
  }

  return children
}
