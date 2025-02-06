import type { AppConfig } from '@/types/config'
import type { AppModeEnum, ThemeEnum, LanguageEnum } from '@/enums/appEnum'

import type { RouteObject } from '@/router/types'

export interface UserInfo {
  userId: string | number
  username: string
  realName: string
  avatar: string
  token: string
  desc?: string
  homePath?: string
  permissions: Permission[]
}
export interface Permission {
  path: string
  fullPath: string
  name: string
  title: string
  tKey?: string
  children?: Permission[]
}
export interface UserState {
  userInfo: Nullable<UserInfo>
  token?: string
  sessionTimeout?: boolean
  lastUpdateTime: number
  permissions: Permission[]
  setToken: (token: string | undefined) => void
  setUserInfo: (userInfo: any) => void
  setPermissions: (permissions: Permission[]) => void
  setSessionTimeout: (timeout: boolean) => void
  resetState: () => void
}

export interface MenuOptions {
  path: string
  title: string
  icon?: string
  isLink?: string
  close?: boolean
  children?: MenuOptions[]
}

export interface MenuState {
  menuList: MenuOptions[]
  isCollapse: boolean
  setMenuList: (menuList: any[]) => void
  updateCollapse: (isCollapse: boolean) => void
}

export interface TagsState {
  visitedTags: RouteObject[]
  cachedTags: Set<string>
  addVisitedTags: (tag: RouteObject) => void;
  updateVisitedTags: (tags: RouteObject[]) => void;
  closeTagsByType: (type: string, path: string) => void;
  updateCacheTags: () => void;
  clearCacheTags: () => void;
  closeTagByKey: (path: string) => Promise<{ tagIndex: number; tagsList: RouteObject[] }>;
  closeAllTags: () => Promise<RouteObject[]>;
}

export interface AppState {
  appMode?: AppModeEnum

  themeMode?: ThemeEnum

  appConfig: AppConfig | null,

  language: LanguageEnum

  setAppMode?: (appMode: AppModeEnum | undefined) => void
  setThemeMode?: (themeMode: ThemeEnum) => void
  setAppConfig?: (appConfig: Partial<AppConfig>) => void
  setLanguage?: (language: LanguageEnum) => void
  resetState?: () => void
}
