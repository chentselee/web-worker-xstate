import { createMachine, interpret } from "xstate";
import PingWorker from "./worker.ts?worker";
import { delay, delaySync } from "./delay";

const pingWorker = new PingWorker();

interface MainMachineContext {}

type PingEvent = { type: "PING" };
type PongEvent = { type: "PONG" };
type MainMachineEvent = PingEvent | PongEvent;

type MainMachineState =
  | { value: "idle"; context: MainMachineContext }
  | { value: "waitingForResponse"; context: MainMachineContext }
  | { value: "received"; context: MainMachineContext };

export const mainMachine = createMachine<
  MainMachineContext,
  MainMachineEvent,
  MainMachineState
>({
  initial: "idle",
  states: {
    idle: {
      on: {
        PING: {
          target: "waitingForResponse",
        },
      },
    },
    waitingForResponse: {
      invoke: {
        src: "ping",
      },
      on: {
        PONG: {
          target: "received",
        },
      },
    },
    received: {
      after: {
        3000: "idle",
      },
    },
  },
});

export const pingWorkerService = interpret(
  mainMachine.withConfig({
    services: {
      ping: () => () => {
        pingWorker.postMessage({ type: "PING" });
      },
    },
  })
).start();

pingWorker.onmessage = (e) => {
  if (e.data.type === "PONG") {
    pingWorkerService.send({ type: "PONG" });
  }
};

export const pingSyncService = interpret(
  mainMachine.withConfig({
    services: {
      ping: () => (send) => {
        console.log("sync start");
        delaySync(5);
        send({ type: "PONG" });
        console.log("sync end");
      },
    },
  })
).start();

export const pingAsyncService = interpret(
  mainMachine.withConfig({
    services: {
      ping: () => async (send) => {
        console.log("async start");
        await delay(5);
        send({ type: "PONG" });
        console.log("async end");
      },
    },
  })
).start();
