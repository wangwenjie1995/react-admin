import type { Locale } from 'antd/es/locale'
import enUS from 'antd/locale/en_US'
import zhCN from 'antd/locale/zh_CN'
import { useEffect, useState } from 'react'
import i18n, { changeLanguage } from 'i18next'
import { useAppDispatch, useAppSelector } from '@/stores'
import { setLanguage } from '@/stores/modules/app'
import { LanguageEnum } from '@/enums/appEnum'
import { getBrowserLang } from '@/utils'

const useLanguage = () => {
  const language = useAppSelector((state) => state.app.language)
  const dispatch = useAppDispatch()
  const [locale, setLocal] = useState<Locale>(zhCN)
  // 设置 antd 语言国际化
  const setAntdLanguage = () => {
    // 如果 redux 中有默认语言就设置成 redux 的默认语言，没有默认语言就设置成浏览器默认语言
    if (language && language == LanguageEnum.ZH) return setLocal(zhCN)
    if (language && language == LanguageEnum.EN) return setLocal(enUS)
    if (getBrowserLang() == LanguageEnum.ZH) return setLocal(zhCN)
    if (getBrowserLang() == LanguageEnum.EN) return setLocal(enUS)
  }
  useEffect(() => {
    dispatch(setLanguage(language || getBrowserLang()))
    i18n.changeLanguage(language || getBrowserLang())
    setAntdLanguage();
  }, [language])
  return {
    locale
  }
}

export default useLanguage
