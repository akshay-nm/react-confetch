import './index.css'

import { ConfetchContext } from 'react-confetch'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <ConfetchContext.Provider value={{}}>
    <App />
  </ConfetchContext.Provider>, document.getElementById('root'))
