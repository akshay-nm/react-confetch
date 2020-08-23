# react-confetch

> Configurable Fetch exposed as a React Hook

[![NPM](https://img.shields.io/npm/v/react-confetch.svg)](https://www.npmjs.com/package/react-confetch) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-confetch
```

## Usage

### You can specify global configuration for all fetch requests via the `ConfetchContext`. Wrap it around your app like this:

```jsx
import './index.css'

import { ConfetchContext } from 'react-confetch'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const globalFetchConfig = {
  timeoutDuration: 3000,
}

ReactDOM.render(
  <ConfetchContext.Provider value={globalFetchConfig}>
    <App />
  </ConfetchContext.Provider>, document.getElementById('root'))

```

Here is a list of configuration options accepted at the moment: 

key | acceptable values | description
--- | --- | ---
`method` | `GET`, `PUT`, `POST` and `DELETE` | Directly fed to `window.fetch`, default is `GET`
`url` | Valid `url`, for example, `https://avatars.githubusercontent.com` | Directly fed to `window.fetch`
`endpoint` | In the form of `/ENDPOINT`, for example, `/akshay-nm` is an enpoint in `https://avatars.githubusercontent.com/akshay-nm` | This is not necessary if you have included the endpoint in our url string. You don't have to pass `/akshay-nm` as `endpoint` if your `url` is `https://avatars.githubusercontent.com/akshay-nm`.
`query` | In the form of `abc=xyz&pqr=2`, i.e., without `?` | This is also optional, you don't need this if your url contains the query part also.
`body` | Serializable object | The hook uses `JSON.stringify()` internally so you can pass objects.
`timeoutDuration` | integer | Time in millis (`Default is 3000`)
`headers` | object containing headers, for example, `{ 'Content-Type': 'application/json' }` | Self explanatory
`onResponse` | Function | This is called on successful fetch request, the hook does not check the status code for you, the fetch response is passed on to this function as an argument and its return value is mapped to the `data` return value of the hook. **This function should return a promise.** Default is `res => res.json()`
`onError` | Function | This is called if there are any uncatched errors (including any arising from onResponse function). Default is `e => e`

Global configuration object supplied by the `ConfetchContext` and local configuration object argument of the `useConfetch` follow the same aforementioned spec. 
**Local configuration takes precedence.**

### Use the hook like this:

```jsx
import React from 'react'
import { useConfetch } from 'react-confetch'

const App = () => {
  const convertResponseToImageData = res => res.blob().then(image => URL.createObjectURL(image))

  const config = {
    url: 'https://avatars.githubusercontent.com',
    endpoint: '/akshay-nm',
    body: null,
    method: 'GET',
    timeoutDuration: 10,
    onResponse: convertResponseToImageData, // this is where you add logic to handle the response, any return value will be set as data
    // onError: err => {}, // you can pass an error handler too, any return values will be assigned to error
    // any error thrown is returned as error
  }

  const { data, loading, error, send } = useConfetch(config)

  return (
    <div>
      <div>{data && <img src={data} alt='Image' />}</div>
      <div>loading: {loading? 'yes' : 'no'}</div>
      <div>error: {error? error.message: '-'}</div>
      <div>
        <button onClick={send} disabled={loading || loading === null}>Send a fetch request</button>
      </div>
    </div>
  )
}

export default App

```

The hook returns an object with 4 keys: 
- data 
- loading (`false` means request finished loading but some cleanup is required before the next request, `null` means ready)
- error 
- send

`send()` can be used to send a fetch request.

## License

MIT © [akshay-nm](https://github.com/akshay-nm)
