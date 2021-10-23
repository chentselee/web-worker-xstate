import { createMachine, interpret } from 'xstate'
import PingWorker from './worker.ts?worker'

const pingWorker = new PingWorker()

interface MainMachineContext { }

type PingEvent = { type: "PING" }
type PongEvent = { type: "PONG" }
type MainMachineEvent = PingEvent | PongEvent

type MainMachineState = { value: "idle", context: MainMachineContext } | { value: "waitingForResponse", context: MainMachineContext } | { value: "received", context: MainMachineContext }

const mainMachine = createMachine<MainMachineContext, MainMachineEvent, MainMachineState>({
  initial: "idle",
  states: {
    idle: {
      on: {
        PING: {
          target: "waitingForResponse",
          actions: 'ping'
        },
      }
    },
    waitingForResponse: {
      on: {
        PONG: {
          target: "received"
        }
      }
    },
    received: {
      after: {
        3000: 'idle'
      }
    }
  }
})

export const mainService = interpret(mainMachine.withConfig({
  actions: {
    ping: () => {
      pingWorker.postMessage({ type: "PING" })
    }
  }
})).start()

pingWorker.onmessage = (e) => {
  if (e.data.type === 'PONG') {
    mainService.send({ type: "PONG" })
  }
}
