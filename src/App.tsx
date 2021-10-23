import { useActor } from '@xstate/react'
import { mainService } from './main.machine'
import { Container, Flex, Button, Heading, Badge, ScaleFade, Text } from '@chakra-ui/react'
import { match } from 'ts-pattern'

function App() {
  const [state, send] = useActor(mainService)

  return (
    <Container maxWidth="container.sm">
      <Flex direction="column" alignItems="center">
        <Button marginBlockStart={8} disabled={!state.matches('idle')} onClick={() => send({ type: "PING" })}>ping</Button>
        <Heading size="sm" marginBlockStart={4}>status:
          <Badge marginInlineStart={2} colorScheme={match(state).when((state) => state.matches('idle'), () => 'gray').when((state) => state.matches('waitingForResponse'), () => 'blue').when((state) => state.matches('received'), () => 'green').otherwise(() => 'gray')}>{state.value}</Badge>
        </Heading>
        <ScaleFade in={state.matches('received')} unmountOnExit initialScale={0.5}>
          {<Text marginBlockStart={4} fontSize="xl" fontWeight="bold">Pong!</Text>}
        </ScaleFade>
      </Flex>
    </Container>
  )
}

export default App
