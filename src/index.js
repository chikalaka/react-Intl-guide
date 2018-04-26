import React from 'react'
import { flatten } from 'flat'
import IntlMessageFormat from 'intl-messageformat'
import { addLocaleData, IntlProvider } from 'react-intl'
import { compose, withStateHandlers } from 'recompose'

let userLocaleInput;

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

const getDefaultLocale = () => {
  const locale = userLocaleInput || navigator.language
  const localeWithoutRegionCode = locale.toLowerCase().split(/[-_]+/)[0]
  try {
    const fileExists = require(`translations/${localeWithoutRegionCode}.js`)
    return localeWithoutRegionCode
  } catch (e) {
    return 'en'
  }
}

const getLocaleFile = (locale) => {
  let supportedLocale;
  let file;
  try {
    file = require(`translations/${locale}.js`)
    supportedLocale = locale
  } catch (e) {
    try {
      file = require(`translations/en.js`)
    } catch (e) {
      console.error(e, 'You MUST have a directory called translations and a file inside called en.js')
    }
    supportedLocale = 'en'
  }
  addLocaleData(getLocaleData([supportedLocale]))
  return file
}

const getFlattenLocaleMessages = () => {
  const locale = getDefaultLocale()
  const file = getLocaleFile(locale)
  try {
    return flatten(file.translation)
  } catch (e) {
    console.error(`Error: an error occurred while trying to flatten translation, make sure you have exported an object called "translation"`)
    return {}
  }
}

const getLocaleData = (supportedLocales = ['en']) =>
  supportedLocales.reduce((acc, lang) => {
    try {
      return [...acc, ...require(`react-intl/locale-data/${lang}`)]
    } catch (e) {
      console.error(`Error: Module not found: Can't resolve 'react-intl/locale-data/${lang}'`)
    }
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

const withReactIntl = BaseComponent => {
  return enhance((props) =>
    <IntlProvider locale={getDefaultLocale()} messages={getFlattenLocaleMessages()}>
      <BaseComponent {...props} />
    </IntlProvider>)
}

export default withReactIntl
