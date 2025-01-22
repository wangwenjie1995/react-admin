import type { UserState, Permission } from '@/stores/types'
import { TOKEN_KEY, USER_INFO_KEY, PERMISSIONS } from '@/enums/cacheEnum'
import { setAuthCache } from '@/utils/auth'

import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      token: undefined,
      userInfo: null,
      permissions: [],
      sessionTimeout: false,
      lastUpdateTime: 0,
      setToken: (token: any) => {
        set({ token: token ? token : '' })
        setAuthCache(TOKEN_KEY, token)
      },
      setUserInfo: (userInfo: any) => {
        set({ userInfo, lastUpdateTime: new Date().getTime() })
        setAuthCache(USER_INFO_KEY, userInfo)
      },
      setPermissions: (permissions: any) => {
        set({ permissions })
        setAuthCache(PERMISSIONS, permissions)
      },
      setSessionTimeout: (sessionTimeout: any) => {
        set({ sessionTimeout })
      },
      resetState: () => {
        set({
          userInfo: null,
          token: undefined,
          sessionTimeout: false,
          lastUpdateTime: 0,
          permissions: [],
        })
      }
    }),
    {
      name: 'user-storage',
    }
  )
)

export default useUserStore
