import { useActor } from '@xstate/react'
import { mainService } from './main.machine'

function App() {
  const [state, send] = useActor(mainService)

  return (
    <div className='App'>
      <button onClick={() => send({ type: "PING" })}>ping</button>
      <div>status: {state.value}</div>
      {state.matches('received') && <div>pong!</div>}
    </div>
  )
}

export default App
