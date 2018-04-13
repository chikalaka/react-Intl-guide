# react-intl-guide

A Guide for internationalize React apps with react-intl and intl-messageformat.
With react-intl we can load locale messages through a component - this is the recommended way.
With intl-messageformat we can load locale messages as a string - this is not the recommended way, since I don't support all the edge case that are supported through the react-intl component.

### Pre steps
- check the documentation of react-intl and be sure that it is what you want.

### Step 1 - add locale data
index.js:
setLocaleData(['en', 'es', ...], `intl-langs/`)
first arg: array of all supported languages
second arg: directory location of the supported languages

or remove step 1 and add it to withIntlProvider

### Step 2 - add provider
Wrap App with the HOC - withIntlProvider:
const App = withIntlProvider(() =>
    ...
)

### Step 3 - add locale messages to the directory of your supported languages
requirements:
- files should be .js
- files should be named after the locale you want (e.g. en.js, es.js)
- files should contain an object
example (from react-intl examples):
en.js:
const NUM_OF_PERSONS = `{numOfPersons, plural, 
=undefined {0} 
=0 {0}
one {, 1 Person} 
other {, # Persons} 
}`
{
    welcome: `Hello {name}`,
    CommentList: {
        numberOfComments: `There {numOfComments, plural, one {is one comment} other {are {numOfComments} comments}}`,
        numberOfPersons: `Total: ${NUM_OF_PERSONS}`
    }
}
recommended conventions:
- message ids that are not generic and should be used only in a specific component (aka numberOfComments in CommentList) should be nested in an id with the name of the component (aka CommentList PascalCase).
- message ids should not start with an Uppercase, unless it is a component, obviously for confusion reasons.

### Start coding
Now you can simply get a locale message, either by a string or a component:
Component: <FormattedMessage id='CommentList.numberOfComments' values={{ numOfPersons: 8 }} />
String: formatIntlLiteral({ id: 'CommentList.numberOfComments', values: { numOfPersons: 8 } })

### Wiki
check the Wiki tab to see all the steps the code were done with

Wiki
### load locale data with addLocaleData from react-intl
- languages are loaded dynamically from react-intl/locale-data/${locale}
- supported languages from your directory are also loaded dynamically
- locale is resolved from the browser by navigator.language and gets the locale without region code (i.e. 'fr-Fr' is resolved to 'fr')
- your locale js files are flatten with { flatten } from 'flat'
- formatIntlLiteral has the following fallback algorithm:
    1. Lookup and format the translated message at id, passed to <IntlProvider> with values.
    2. Fallback to formatting the defaultMessage.
    3. Fallback to source of translated message at id.
    4. Fallback to the literal message id.
    
-


