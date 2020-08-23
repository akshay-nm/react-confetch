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
