import React from 'react'
import { useConfetch, ConfetchContext } from './index'
import { renderHook, act } from '@testing-library/react-hooks'
import fetchMock from 'fetch-mock'

const ConfetchContextProvider = ({ defaultConfig, children }) => (
  <ConfetchContext.Provider value={defaultConfig}>
    {children}
  </ConfetchContext.Provider>
)

describe('useConfetch', () => {
  let res, waitForIt
  beforeEach(() => {
    fetchMock.restore()
    const config = {
      url: 'https://avatars.githubusercontent.com',
      endpoint: '/akshay-nm',
      body: null,
      method: 'GET',
      timeoutDuration: 1000
    }
    const wrapper = ({ children }) => (
      <ConfetchContextProvider defaultConfig={{}}>
        {children}
      </ConfetchContextProvider>
    )
    const { result, waitForNextUpdate } = renderHook(
      () => useConfetch(config),
      { wrapper }
    )

    res = result
    waitForIt = waitForNextUpdate
  })
  it('initializes properly', () => {
    expect(res.current.data).toBe(null)
    expect(res.current.error).toBe(null)
    expect(res.current.loading).toBe(null)
  })
  it('sends a request when "the send method" is called', async () => {
    fetchMock.get(
      'begin:https://avatars.githubusercontent.com',
      { test: 'test' },
      { delay: 100 }
    )
    act(() => res.current.send())
    await waitForIt()
    expect(res.current.error).toBe(null)
    expect(
      fetchMock.called('begin:https://avatars.githubusercontent.com')
    ).toBeTruthy()
  })
  it('aborts a sent request as per timeoutDuration', async () => {
    fetchMock.get(
      'begin:https://avatars.githubusercontent.com',
      { test: 'test' },
      { delay: 2000 }
    )
    act(() => res.current.send())
    await waitForIt()
    expect(
      fetchMock.called('begin:https://avatars.githubusercontent.com')
    ).toBeTruthy()
    expect(res.current.error).toBeTruthy()
  })
  it('sends a request when "the send method" is called again after abort', async () => {
    fetchMock.get(
      'begin:https://avatars.githubusercontent.com',
      { test: 'test' },
      { delay: 2000 }
    )
    act(() => res.current.send())
    expect(res.current.loading).toBe(true)
    await waitForIt()
    expect(res.current.loading).toBe(null)
    act(() => res.current.send())
    await waitForIt()
    expect(
      fetchMock.calls('begin:https://avatars.githubusercontent.com').length
    ).toEqual(2)
    expect(res.current.error).toBeTruthy()
  })
})
