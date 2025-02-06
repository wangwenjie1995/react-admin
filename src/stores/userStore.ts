import type { UserState, Permission } from '@/stores/types'
import { create } from 'zustand';
import { persist } from 'zustand/middleware'


const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: undefined,
      userInfo: null,
      permissions: [],
      sessionTimeout: false,
      lastUpdateTime: 0,
      setToken: (token: any) => {
        set({ token: token ? token : '' })
      },
      setUserInfo: (userInfo: any) => {
        set({ userInfo, lastUpdateTime: new Date().getTime() })
      },
      setPermissions: (permissions: any) => {
        set({ permissions })
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
