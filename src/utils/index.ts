import { isObject } from './is'
import { LanguageEnum } from '@/enums/appEnum'

export function openWindow(
  url: string,
  opt?: {
    target?: TargetContext | string
    noopener?: boolean
    noreferrer?: boolean
  }
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  noopener && feature.push('noopener=yes')
  noreferrer && feature.push('noreferrer=yes')

  window.open(url, target, feature.join(','))
}

export function promiseTimeout(ms: number, throwOnTimeout = false, reason = 'Timeout'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout) setTimeout(() => reject(reason), ms)
    else setTimeout(resolve, ms)
  })
}

export const searchRoute: any = (path: string, routes: any = []) => {
  for (const item of routes) {
    if (item.path === path || item.fullPath === path) return item
    if (item.children) {
      const result = searchRoute(path, item.children)
      if (result) return result
    }
  }
  return null
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
  }
  return src
}

export const getBrowserLang = () => {
  let browserLang = navigator.language
  let defaultBrowserLang
  if (
    browserLang.toLowerCase() === 'cn' ||
    browserLang.toLowerCase() === 'zh' ||
    browserLang.toLowerCase() === 'zh-cn'
  ) {
    defaultBrowserLang = LanguageEnum.ZH
  } else {
    defaultBrowserLang = LanguageEnum.EN
  }
  return defaultBrowserLang
}

export const onMove = (callback: (event: MouseEvent) => void, removeCallback?: () => void) => {
  // 鼠标移动事件处理函数
  const moveEvent = (event: MouseEvent) => {
    // 如果鼠标左键未按下，移除所有事件监听
    if (event.buttons !== 1) {
      remove()
      return
    }
    callback(event) // 执行移动时的逻辑
  }
  const remove = () => {
    window.removeEventListener('mousemove', moveEvent)
    window.removeEventListener('mouseup', remove)
    window.removeEventListener('contextmenu', remove)
    removeCallback?.()
  }
  window.addEventListener('mousemove', moveEvent)
  window.addEventListener('contextmenu', remove) // 右键菜单触发时清理
  window.addEventListener('mouseup', remove) // 鼠标抬起时清理
  // 返回手动移除事件监听的函数
  return remove
}

export const onMoveRequestAnimation = (callback: (event: MouseEvent) => void, removeCallback?: () => void) => {
  let isMoving = false //是否在移动
  let lastEvent: MouseEvent | null = null //存储最近的鼠标事件
  let animationFrameId: number | null = null //用于取消requestAnimationFrame

  const moveEvent = (event: MouseEvent) => {
    if (event.buttons !== 1) {
      remove() // 鼠标左键未按下时清理事件
      return
    }
    lastEvent = event //保存最新的鼠标事件
    isMoving = true //标记正在移动
  }
  const loop = () => {
    if (isMoving && lastEvent) {
      callback(lastEvent) //处理最新的鼠标事件
      isMoving = false // 重置标记
    }
    animationFrameId = requestAnimationFrame(loop) //循环监听
  }
  const remove = () => {
    window.removeEventListener('mousemove', moveEvent)
    window.removeEventListener('mouseup', remove)
    window.removeEventListener('contextmenu', remove)
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId) // 取消帧循环
      animationFrameId = null
    }
    removeCallback?.()
  }
  window.addEventListener('mousemove', moveEvent)
  window.addEventListener('mouseup', remove) // 鼠标抬起时清理
  window.addEventListener('contextmenu', remove) // 右键菜单触发时清理
  //启动帧循环
  animationFrameId = requestAnimationFrame(loop)
  return remove //返回清理函数
}
