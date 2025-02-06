import type { Locale } from 'antd/es/locale'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { useEffect, useState } from 'react'
import i18n, { changeLanguage } from 'i18next'
import { LanguageEnum } from '@/enums/appEnum'
import { getBrowserLang } from '@/utils'
import useAppStore from '@/stores/modules/appStore'

const useLanguage = () => {
  const language = useAppStore((state) => state.language)
  const setLanguage = useAppStore((state) => state.setLanguage)
  const [locale, setLocal] = useState<Locale>(zhCN)
  // 设置 antd 语言国际化
  const setAntdLanguage = () => {
    // 如果 zustand 中有默认语言就设置成 zustand 的默认语言，没有默认语言就设置成浏览器默认语言
    if (language && language == LanguageEnum.ZH) return setLocal(zhCN)
    if (language && language == LanguageEnum.EN) return setLocal(enUS)
    if (getBrowserLang() == LanguageEnum.ZH) return setLocal(zhCN)
    if (getBrowserLang() == LanguageEnum.EN) return setLocal(enUS)
  }
  useEffect(() => {
    const browserLang = getBrowserLang() // 获取浏览器语言
    const finalLang = language || browserLang // 优先使用应用的语言
    setLanguage?.(finalLang)
    i18n.changeLanguage(language || getBrowserLang())
    setAntdLanguage();
  }, [language])
  return {
    locale
  }
}

export default useLanguage
