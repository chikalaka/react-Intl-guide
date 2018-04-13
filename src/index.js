import { addLocaleData } from 'react-intl'

export const formatIntlLiteral = ({ id, values }) => {
  const msg = getFlattenLocaleMessages()[id]

  let formattedMessage = id
  if (msg) {
    const intlMsg = new IntlMessageFormat(msg)
    try {
      formattedMessage = intlMsg.format(values)
    } catch (error) {
      console.error(error)
      formattedMessage = msg
    }
  } else {
    console.error(`Error: Missing id: '${id}' for locale: "${getLocaleWithoutRegionCode()}", using message id as fallback`)
  }

  return formattedMessage
}

const getLocaleWithoutRegionCode = () => navigator.language.toLowerCase().split(/[-_]+/)[0]

export const getSupportedLocale = () => {
  const locale = getLocaleWithoutRegionCode()
  return isLocaleSupported(locale) ? locale : 'en'
}

const isLocaleSupported = (locale) => globalConfig.supportedLanguages.indexOf(locale) > -1

const getLocaleFile = locale => {
  try {
    return require(`intl/${locale}.js`)
  } catch (e) {
    return require(`intl/en.js`)
  }
}

export const getFlattenLocaleMessages = () => {
  const locale = getSupportedLocale()
  const file = getLocaleFile(locale)
  return flatten(file.translation)
}

const getLocaleData = () =>
globalConfig.supportedLanguages.reduce((acc, lang) => {
  try {
    return [...acc, ...require(`react-intl/locale-data/${lang}`)]
} catch (e) {
  console.error(`Error: Module not found: Can't resolve 'react-intl/locale-data/${lang}'`)
}
}, [])

export const setLocaleData = addLocaleData(getLocaleData());