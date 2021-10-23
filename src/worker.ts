import { delay } from './delay'

onmessage = async (e) => {
  if (e.data.type === 'PING') {
    await delay(5)
    postMessage({ type: 'PONG' })
  }
}
