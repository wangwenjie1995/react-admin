import type { MenuState } from '../types'

import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      menuList: [],
      isCollapse: false,
      setMenuList: (menuList: any) => {
        set({ menuList })
      },
      updateCollapse: (isCollapse: boolean) => {
        set({ isCollapse })
      },
    }),
    {
      name: 'menu-storage',
    }
  )
)


export default useMenuStore
