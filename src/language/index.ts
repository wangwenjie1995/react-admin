import i18n from 'i18next'
import en from './modules/en'
import zh from './modules/zh'
import { initReactI18next } from 'react-i18next'
import { LanguageEnum } from '@/enums/appEnum'
const resources = {
  [LanguageEnum.EN]: {
    translation: en
  },
  [LanguageEnum.ZH]: {
    translation: zh
  }
}
i18n.use(initReactI18next).init({
  resources,
  // 选择默认语言，选择内容为上述配置中的 key，即 en/zh
  fallbackLng: LanguageEnum.ZH,
  debug: false,
  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  }
})

export default i18n
