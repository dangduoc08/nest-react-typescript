const en = require('./en.json')
const vi = require('./vi.json')
import i18next from 'i18next'
import {
  initReactI18next
} from 'react-i18next'
import {
  LOCALE
} from '@commons/constants'

export function i18n(lang: string = LOCALE.EN.VALUE) {
  i18next
    .use(initReactI18next)
    .init({
      resources: {
        en,
        vi
      },
      lng: lang,
      fallbackLng: lang,
      debug: false,
      keySeparator: false
    })
}
