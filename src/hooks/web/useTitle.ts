import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTitle as usePageTitle } from 'ahooks'
import { searchRoute } from '@/utils'
import useUserStore from '@/stores/userStore'

// 监听页面变化和动态改变网站标题
export function useTitle() {
  const [pageTitle, setPageTitle] = useState('bigoc')
  const permissions = useUserStore((state) => state.permissions);
  const { pathname } = useLocation()

  useEffect(() => {
    const currRoute = searchRoute(pathname, permissions)
    setPageTitle(currRoute.title)
  }, [pathname, permissions])

  usePageTitle(pageTitle)
}
