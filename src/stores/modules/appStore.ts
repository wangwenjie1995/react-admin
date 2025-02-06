import type { AppState } from '../types'
import { LanguageEnum } from '@/enums/appEnum'
import { deepMerge } from '@/utils'

import { create } from 'zustand';
import { persist } from 'zustand/middleware'

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      appMode: undefined,
      themeMode: undefined,
      appConfig: null,
      language: LanguageEnum.ZH,
      setAppMode: (appMode: any) => {
        set({ appMode })
      },
      setThemeMode: (themeMode: any) => {
        set({ themeMode })
      },
      setAppConfig: (appConfig) => {
        set((state) => {
          const updatedConfig = deepMerge(state.appConfig || {}, appConfig);
          return { appConfig: updatedConfig };
        });
      },
      setLanguage: (language) => {
        set({ language })
      },
      resetState: () => {
        set({
          appMode: undefined,
          themeMode: undefined,
          appConfig: null,
        })
      }
    }),
    {
      name: 'app-storage',
    }
  )
)


export default useAppStore
