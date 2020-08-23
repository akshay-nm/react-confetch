import { useContext, useState, useCallback, useEffect } from "react"
import ConfetchContext from "./context"

const Timeout = (fn, interval) => {
  let timeout = {}
  timeout.id = setTimeout(fn, interval)
  timeout.cleared = false
  timeout.clear = function () {
    if(!this.cleared) {
      timeout.cleared = true
      clearTimeout(timeout.id)
    }
  }
  return timeout
}

export default function useConfetch(config) {

  const defaultConfig = useContext(ConfetchContext) 

  const [controller, setController] = useState(new AbortController())


  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(null) // loading null means request can be made, false means the request ended and refresh is in process
  const [error, setError] = useState(null)
  const send = useCallback(() => {
    if(loading === null) {
      const signal = controller.signal
  

      const headers = {
        ...defaultConfig?.headers,
        ...config?.headers
      }

      const method = config?.method || defaultConfig?.method || 'GET'
      const url = config?.url
      const endpoint = config?.endpoint || ''
      const query = config?.query? `?${config.query}` : ''
  
      const body = config?.body? JSON.stringify(config.body) : null

      // process the response, parse response to json by default
      const onResponse = config?.onResponse || (res => res.json())

      // process errors
      const onError = config?.onError || (e => e)


      const timeoutDuration = config?.timeoutDuration || defaultConfig?.timeoutDuration || 3000
      const timeout = Timeout(() => controller.abort(), timeoutDuration)


      fetch(`${url}${endpoint}${query}`, { method, headers, body, signal })
        .then(async res => {
          timeout.clear()
          setData(await onResponse(res))
          setLoading(false)
        }).catch(e => {
          timeout.clear()
          setError(onError(e))
          setLoading(false)
        })
    }
  }, [config, defaultConfig, controller, loading])


  useEffect(() => {
    // recreate the abort controller instance
    if(loading === false) {
      setController(new AbortController())
      setLoading(null)
    }
  }, [loading])



  // return 
  return {
    data,
    loading,
    error,
    send
  }
}