import {
  Badge,
  Button,
  Flex,
  Heading,
  ScaleFade,
  Text,
} from "@chakra-ui/react";
import { match } from "ts-pattern";
import { mainMachine } from "./main.machine";
import { ActorRefFrom } from "xstate";
import { useActor } from "@xstate/react";

interface Props {
  actorRef: ActorRefFrom<typeof mainMachine>;
  buttonText?: string;
}

const Ping: React.FC<Props> = ({ actorRef, buttonText = "ping" }) => {
  const [state, send] = useActor(actorRef);
  return (
    <Flex direction="column" alignItems="center">
      <Button
        disabled={!state.matches("idle")}
        onClick={() => send({ type: "PING" })}
      >
        {buttonText}
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
    </Flex>
  );
};

export default Ping;
