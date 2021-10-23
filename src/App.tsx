import { useEffect, useState } from 'react'
import PingWorker from './worker?worker'

const pingWorker = new PingWorker()

type Status = 'idle' | 'waiting' | 'received'

function App() {
  const [response, setResponse] = useState(() => '')
  const [status, setStatus] = useState<Status>(() => 'idle')
  const [timeoutId, setTimeoutId] = useState<number>()

  useEffect(() => {
    pingWorker.onmessage = (e) => {
      if (status === 'waiting' && e.data.type === 'PONG') {
        setStatus('received')
        setResponse('pong!')
        setTimeoutId(
          setTimeout(() => {
            setStatus('idle')
            setResponse('')
          }, 3000)
        )
      }
    }
  }, [status])

  useEffect(() => {
    return () => {
      if (typeof timeoutId === 'number') {
        clearTimeout(timeoutId)
      }
    }
  }, [timeoutId])

  return (
    <div className='App'>
      <button
        onClick={() => {
          if (status === 'idle') {
            pingWorker.postMessage({ type: 'PING' })
            setStatus('waiting')
          }
        }}
      >
        ping
      </button>
      <div>status: {status}</div>
      <div>{response}</div>
      <label htmlFor='other-input'>other input</label>
      <input type='text' id='other-input' name='other-input' />
    </div>
  )
}

export default App
