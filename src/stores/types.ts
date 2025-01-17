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
}

export interface TagsState {
  visitedTags: RouteObject[]
  cachedTags: Set<string>
}

export interface AppState {
  appMode?: AppModeEnum

  themeMode?: ThemeEnum

  appConfig: AppConfig | null,

  language: LanguageEnum
}
