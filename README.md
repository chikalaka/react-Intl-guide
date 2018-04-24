# with-react-intl

description: 
Internationalize React apps with a simple HOC and retrieve localized message either by a Component (with yahoo/react-intl) or as a String 

Internationalize React apps with [**react-intl**](https://github.com/yahoo/react-intl) and [**intl-messageformat**](https://github.com/yahoo/intl-messageformat) with a simple HOC - `withReactIntl`.
From `react-intl` we can load locale messages through a Component.
With the use of `intl-messageformat` we can load locale messages as a String.

Features:
- Internationalize with one simple HOC
- Figure the user locale from the browser or from the user input
- Inject props: `locale` and `setLocale`, to get and set locale manually
- Get formatted message as a String

TL;DR steps:
1. Create translations files (.js)
2. import localeData from react-intl/locale-data and your translations files
3. Wrap App with withReactIntl HOC and pass localeData and translations
Done!

### Install
```
npm i react-intl with-react-intl --save
```
Or:
```
yarn add react-intl with-react-intl
```

## Step 1 - Create translations files
Create js files containing an object with all the translated messages.
requirements:
- files should be *.js
example:
```js
// en.js
const NUM_OF_PERSONS = `{numOfPersons, plural, 
    =undefined {0} 
    =0 {0}
    one {, 1 Person} 
    other {, # Persons} 
}`
export const translation = {
    welcome: `Hello {name}`,
    CommentList: {
        numberOfComments: `There {numOfComments, plural, one {is one comment} other {are {numOfComments} comments}}`,
        numberOfPersons: `Total: ${NUM_OF_PERSONS}`
    }
    // ...
}
```
recommended conventions:
- message ids that are not generic and should be used only in a specific component (aka `numberOfComments` in `CommentList`) should be nested in an id with the name of the component (aka `CommentList` PascalCase).
- message ids should not start with an Uppercase, unless it is a component, obviously for confusion reasons.

### Step 2 - import supported localeData and translations files
example:
```js
// App.js
import enLocaleData from 'react-intl/locale-data/en'
import esLocaleData from 'react-intl/locale-data/es'
import {translation as en} from 'translations/en'
import {translation as es} from 'translations/es'
// ...
```

requirements
- import only supported locales!

### Step 3 - Wrap your `App`
Wrap your app component with the HOC - `withReactIntl`
Pass an object containing `localeData` and `translations` - both required.
`localeData` - Array of localeData from `react-intl`
`translations` - Object containing locales as keys and messages as values
App.js:
```js
import React from 'react'
import withReactIntl from 'with-react-intl'
// imports from step 2

const App = () =>
  <div>
    // ...
  </div>

export default withReactIntl({localeData: [enLocaleData, esLocaleData], translations: { en, es }})(App)
```

### Start coding
Now you can simply get a locale message, either as a String or as a Component:
example for getting a Component: 
```js
import { FormattedMessage } from 'react-intl'

const FormattedComponent = () => 
    <FormattedMessage id='CommentList.numberOfPersons' values={{ numOfPersons: 8 }} />
```
example for getting a String: 

```js
import { formatIntlLiteral } from 'with-react-intl'

const formattedString = formatIntlLiteral({ id: 'CommentList.numberOfPersons', values: { numOfPersons: 8 } })
```

### Extra details
- locales are added from `react-intl/locale-data/${locale}` with `addLocaleData` from `react-intl`
- locale is resolved from the browser by `navigator.language` and gets the locale without region code (i.e. 'fr-Fr' is resolved to 'fr')
- `${locale}.js` files are flatten with `{ flatten } from 'flat'`
- `formatIntlLiteral` has the following fallback algorithm:
    1. Lookup and format the translated message at id, passed to `<IntlProvider>` with values.
    2. Fallback to formatting the `defaultMessage`.
    3. Fallback to source of translated message at id.
    4. Fallback to the literal message id.
- how locale is defined?
    - Lookup for user's `locale` input
    - Fallback to `navigator.language` (user preferred language in the browser)
    - Fallback to user's `defaultLocale` input
    - Fallback to `"en"`


