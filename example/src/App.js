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
    timeoutDuration: 5000,
    onResponse: convertResponseToImageData // this is where you add logic to handle the response, any return value will be set as data, has to return a promise.
    // onError: err => {}, // you can pass an error handler too, any return values will be assigned to error
    // any error thrown is returned as error
  }

  const { data, loading, error, send } = useConfetch(config)

  return (
    <div>
      <div>{data && <img src={data} alt='Avatar' />}</div>
      <div>loading: {loading === null ? 'ready' : loading ? 'yes' : 'no'}</div>
      <div>error: {error ? error.message : '-'}</div>
      <div>
        <button onClick={send}>Send a fetch request</button>
      </div>
    </div>
  )
}

export default App
