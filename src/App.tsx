import { useActor } from "@xstate/react";
import { mainService } from "./main.machine";
import {
  Input,
  Container,
  Flex,
  Button,
  Heading,
  Badge,
  ScaleFade,
  Text,
  FormControl,
  FormHelperText,
} from "@chakra-ui/react";
import { match } from "ts-pattern";
import { useState } from "react";

function App() {
  const [state, send] = useActor(mainService);

  const [value, setValue] = useState("");

  return (
    <Container maxWidth="container.sm">
      <Flex direction="column" alignItems="center">
        <Button
          marginBlockStart={8}
          disabled={!state.matches("idle")}
          onClick={() => send({ type: "PING" })}
        >
          ping
        </Button>
        <Heading size="sm" marginBlockStart={4}>
          status:
          <Badge
            marginInlineStart={2}
            colorScheme={match(state)
              .when(
                (state) => state.matches("idle"),
                () => "gray"
              )
              .when(
                (state) => state.matches("waitingForResponse"),
                () => "blue"
              )
              .when(
                (state) => state.matches("received"),
                () => "green"
              )
              .otherwise(() => "gray")}
          >
            {state.value}
          </Badge>
        </Heading>
        <ScaleFade in={state.matches("received")} initialScale={0.5}>
          {
            <Text marginBlockStart={4} fontSize="xl" fontWeight="bold">
              Pong!
            </Text>
          }
        </ScaleFade>
        <FormControl>
          <Input
            marginBlockStart={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <FormHelperText>
            Input will still be responsive even when a blocking task is
            executing in the background.
          </FormHelperText>
        </FormControl>
      </Flex>
    </Container>
  );
}

export default App;
