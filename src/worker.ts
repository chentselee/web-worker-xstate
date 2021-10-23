import { interpret } from 'xstate'
import { workerMachine } from './worker.machine'

const workerService = interpret(workerMachine.withConfig({
  actions: {
    pong: () => {
      postMessage({ type: "PONG" })
    }
  }
})).start()

onmessage = (e) => {
  if (e.data.type === 'PING') {
    workerService.send({ type: "PING" })
  }
}
