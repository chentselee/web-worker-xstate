import { createMachine } from 'xstate'

interface WorkerMachineContext { }

type PingEvent = { type: "PING" }
type WorkerMachineEvent = PingEvent

type WorkerMachineState = { value: "active", context: WorkerMachineContext } | { value: "pinged", context: WorkerMachineContext }

export const workerMachine = createMachine<WorkerMachineContext, WorkerMachineEvent, WorkerMachineState>({
  initial: 'active',
  states: {
    active: {
      on: {
        PING: {
          target: "pinged",
        },
      }
    },
    pinged: {
      after: {
        5000: {
          target: "active",
          actions: 'pong'
        }
      }
    }
  }
})

