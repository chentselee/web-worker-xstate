import {
  pingWorkerService,
  pingSyncService,
  pingAsyncService,
} from "./ping.machine";
import {
  Input,
  Container,
  Flex,
  FormControl,
  FormHelperText,
} from "@chakra-ui/react";
import { useState } from "react";
import Ping from "./Ping";

function App() {
  const [value, setValue] = useState("");

  return (
    <Container maxWidth="container.sm">
      <Flex direction="column" alignItems="center">
        <Flex marginBlockStart={8} gridGap={8}>
          <Ping actorRef={pingWorkerService} buttonText="ping worker" />
          <Ping actorRef={pingSyncService} buttonText="ping sync" />
          <Ping actorRef={pingAsyncService} buttonText="ping async" />
        </Flex>
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
