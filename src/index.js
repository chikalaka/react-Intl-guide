import React from 'react'
import { flatten } from 'flat'
import IntlMessageFormat from 'intl-messageformat'
import { addLocaleData, IntlProvider } from 'react-intl'
import { compose, withStateHandlers } from 'recompose'

let userLocaleInput;
let userTranslationsInput;
let userDefaultLocale;

export const formatIntlLiteral = ({ id, values, defaultMessage }) => {
  const msg = getFlattenLocaleMessages()[id]

  let formattedMessage = id
  if (msg) {
    const intlMsg = new IntlMessageFormat(msg)
    try {
      formattedMessage = intlMsg.format(values)
    } catch (error) {
      console.error(error, `using ${defaultMessage ? 'defaultMessage' : 'message id'} as fallback`)
      formattedMessage = defaultMessage || msg
    }
  } else {
    console.error(`Error: Missing id: '${id}' for locale: "${getDefaultLocale()}", using message id as fallback`)
  }

  return formattedMessage
}

const isLocaleSupported = locale => !!userTranslationsInput[locale]

const getDefaultLocale = () => {
  const locale = userLocaleInput || navigator.language
  const localeWithoutRegionCode = locale.toLowerCase().split(/[-_]+/)[0]

  if (isLocaleSupported(localeWithoutRegionCode)) return localeWithoutRegionCode
  return userDefaultLocale || 'en'
}

const getFlattenLocaleMessages = () => {
  const locale = getDefaultLocale()
  const messages = userTranslationsInput[locale] || Object.values(userTranslationsInput)[0]

  return flatten(messages)
}

const getLocaleData = (localeData = []) =>
  localeData.reduce((acc, lang) => {
    return [...acc, ...lang]
  }, [])

const enhance = compose(
  withStateHandlers(
    { locale: navigator.language },
    {
      setLocale: (state, props) => locale => {
        userLocaleInput = locale
        return { locale }
      }
    }
  )
)

const withReactIntl = ({ localeData, translations, defaultLocale }) => BaseComponent => {
  addLocaleData(getLocaleData(localeData))
  userTranslationsInput = translations
  userDefaultLocale = defaultLocale
  return enhance((props) =>
    <IntlProvider locale={getDefaultLocale()} messages={getFlattenLocaleMessages()}>
      <BaseComponent {...props} />
    </IntlProvider>)
}

export default withReactIntl
