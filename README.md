# react-confetch

> Configurable Fetch exposed as a React Hook

[![NPM](https://img.shields.io/npm/v/react-confetch.svg)](https://www.npmjs.com/package/react-confetch) <a href="https://github.com/akshay-nm/react-confetch/blob/master/.prettierrc"><img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"></a> [![Coverage Status](https://coveralls.io/repos/github/akshay-nm/react-confetch/badge.svg?branch=master)](https://coveralls.io/github/akshay-nm/react-confetch?branch=master)

I have written [a blog post](https://medium.com/sdiot-technologies/fetch-abort-controller-timeouts-react-js-e7c71835b007?source=friends_link&sk=153490723790e80c957a599d15bc40c6) to shed some light on how you might use this and I have also included an example included in the description below.
Feel free to create an issue on GitHub repository if you encounter any issues or have some doubts about this package.

**This package is a wrapper around [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) so it will not catch CORS exceptions as it behaves just like Fetch.**

## What it looks like

```
const { result } = useConfetch({ url, ...otherConfigurationOptions })
```

or

```
const { data, error, loading, send } = useConfetch({ url, ...otherConfigurationOptions })
```

## Install

```bash
npm install --save react-confetch
```

## Usage

- Create a `globalConfigurationObject` for all of your fetch requests.
- Wrap your components around `ConfetchContext` initialized with your `globalConfigurationObject`.
- Import the `useConfetch` hook where ever you need to fetch something. Since it's a hook it wont work outside React.

This hook accepts a configration object which can be used to override the `globalConfigurationObject`.

Here is a list of configuration options (both global and local/specific) accessible to you. I'll add an explanation wherever necessary.

### States of hook

| state                       | values                                       |
| --------------------------- | -------------------------------------------- |
| `ready`                     | `data: null`, `error: null`, `loading: null` |
| `fetching`                  | `data: null`, `error: null`, `loading: true` |
| `fetch-complete, resetting` | `data: -`, `error: -`, `loading: false`      |
| `error`                     | `data: -`, `error: -`, `loading: false`      |

The hook resets (reinitialized the AbortController) on completion of a fetch request. The `data` and `error` do not change during reset.
The `data` and `error` do change to `null` when a new fetch request is initialized.

The hook exposes a `send` function which can be used to send a fetch request as per configuration.

### Global Configuration options

| key          | values/type/description                                                                                                 | required | default           |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- | -------- | ----------------- |
| `method`     | Uppercase `string` containing an http method supported by fetch                                                         | `false`  | `GET` '           |
| `headers`    | `object` containing key-value pairs, acceptable by fetch, for example `{ 'Content-Type': 'application/json' }`          | `false`  | `{}`              |
| `onResponse` | `function`, should return a promise, accepts `fetch response` as argument, resolved value is what you get as the `data` | `false`  | `res => res.json` |
| `onError`    | `function` or `null`, accepts `error` as argument, return value is what you get as `error`.                             |

### Local/Specific configuration options (hook customization)

Everything specified above as global configration and ...
key | values/type/description | required | default
--- | --- | --- | ---
`url` | A valid url as a `string` | `true` | `undefined`
`method` | Uppercase `string` containing an http method supported by fetch | `false` | `GET` '
`body` | `object` which does not throw in `JSON.stringify`. | `false` | `null`
`endpoint` | `string`, not required if passed in `url` | `false` | `''`
`query` | `string`, not required if passed in `url` | `false` | `''`, the error here can be a fetch exception or any unhandled exception thrown during a custom `onResponse` | `false` | `null`

**Local configuration takes precedence.**

### Example

**Wrap your container with `ConfetchContext` initilializing it with `globalConfigurationObject`.** The default value for configuration is {}.

```jsx
import './index.css'

import { ConfetchContext } from 'react-confetch'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const globalFetchConfig = {
  timeoutDuration: 3000
}

ReactDOM.render(
  <ConfetchContext.Provider value={globalFetchConfig}>
    <App />
  </ConfetchContext.Provider>,
  document.getElementById('root')
)
```

**Use the hook like this in child/wrapped components**

```jsx
import React from 'react'
import { useConfetch } from 'react-confetch'

const App = () => {
  const convertResponseToImageData = (res) =>
    res.blob().then((image) => URL.createObjectURL(image))

  const config = {
    url: 'https://avatars.githubusercontent.com',
    endpoint: '/akshay-nm',
    body: null,
    method: 'GET',
    timeoutDuration: 10,
    onResponse: convertResponseToImageData // this is where you add logic to handle the response, any return value will be set as data
    // onError: err => {}, // you can pass an error handler too, any return values will be assigned to error
    // any error thrown is returned as error be default
  }

  const { data, loading, error, send } = useConfetch(config)

  return (
    <div>
      <div>{data && <img src={data} alt='Image' />}</div>
      <div>loading: {loading ? 'yes' : 'no'}</div>
      <div>error: {error ? error.message : '-'}</div>
      <div>
        <button onClick={send} disabled={loading || loading === null}>
          Send a fetch request
        </button>
      </div>
    </div>
  )
}

export default App
```

## Future

- Expose a method to `abort` fetch
- Add option to enforce deduping strategies for managing requests
- Improve branching strategies currently being used (I don't have seperate branches for development and releases at the moment)
- Add contributors section in readme
- Document versioning strategy

## Contributing

This is an open source project maintained as a GitHub repository. All contributions are welcome subject to they fit nicely with the direction the project is moving in.
So if you

- have a new idea for a feature
- want to suggest some improvements in the current implementation
- are experiencing some issues
- have some doubts about how everything works
  then, just open an issue on the GitHub repository. You can jump start the process using [this link](https://github.com/akshay-nm/react-confetch/issues/new).

I am also accepting any relevant Pull Requests but there is a way to how they are supposed to be crafted (This will most likely change overtime).

- Checkout the `master` branch with a name relevant to your contributions (I am not a huge fan of `/` in the name, and I'd like if you use `-` instead).
- Commits should be signed. Checkout the documentation on how to Sign your commit for this. **Don't forget to use prettier.**
- Open a PR
  - describe what you did
  - Link an issue so that I know why you did what you did... haha
  - Help me as I review what you did
  - If all goes well, react with a rocket, confetti or something when I merge your changes, yay!

Alright, that's it for now...

## Further reading

- [Managing Fetch requests in React.js](https://medium.com/sdiot-technologies/fetch-abort-controller-timeouts-react-js-e7c71835b007?source=friends_link&sk=153490723790e80c957a599d15bc40c6)
- [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Fetch Basic Concepts](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Basic_concepts)
- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [React Hooks API reference](https://reactjs.org/docs/hooks-reference.html)
- [Testing Advanced hooks](https://react-hooks-testing-library.com/usage/advanced-hooks)

## License

MIT © [akshay-nm](https://github.com/akshay-nm)
