# with-react-intl

Internationalize React apps with a simple HOC and retrieve localized message either by a Component (with yahoo/react-intl) or as a String 

Internationalize React apps with [**react-intl**](https://github.com/yahoo/react-intl) and [**intl-messageformat**](https://github.com/yahoo/intl-messageformat) with a simple HOC - `withReactIntl`.
From `react-intl` we can load locale messages through a Component.
With the use of `intl-messageformat` we can load locale messages as a String.

Features:
- Internationalize with one simple HOC
- Figure the user locale from the browser or from the user input
- Inject props: `locale` and `setLocale`, to get and set locale manually
- Get formatted message as a String
- Load and add locale data and messages dynamically, no need for hard-coding anything

TL;DR steps:
1. Add `${locale}.js` files to `translations` directory
2. Wrap App with withReactIntl HOC
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
- files should be at the directory `ROOT/translations/`
- files should be named after the locale you want (e.g. en.js, es.js)
- files should contain an exported object called `translation`
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

### Step 2 - Wrap your `App`
Wrap your app component with the HOC - `withReactIntl`
```js
// App.js
import React from 'react'
import withReactIntl from 'with-react-intl'

const App = () =>
  <div>
    // ...
  </div>

export default withReactIntl(App)
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
- locales are loaded dynamically from `react-intl/locale-data/${locale}` with `addLocaleData` from `react-intl`
- supported locales from your `translations` directory are also loaded dynamically
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


