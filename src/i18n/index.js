import { createI18n } from 'vue-i18n'

const languese = {
  cn: () => import('./cn.json'),
  en: () => import('./en.json'),
  kh: () => import('./kh.json'),
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'cn',
  fallbackLocale: 'cn',
  messages: {},
})

export const switchLang = async (lang) => {
  try {
    const module = await languese[lang]()

    const message = module.default || module

    i18n.global.setLocaleMessage(lang, message)
    i18n.global.locale.value = lang
  } catch (error) {
    console.error('Failed to switch language:', error)
  }
}

switchLang('cn')

export default i18n
