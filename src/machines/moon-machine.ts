import { createModel } from "xstate/lib/model";
import Oktopod, { EventPayload } from "oktopod";

const model = createModel(
  {},
  {
    events: {
      HELLO: (data: EventPayload<{ moonTemp: string }>) => data,
      SEND_HELLO: (value: any) => value
    }
  }
);

export function createMoonMachine(eventBus: Oktopod) {
  const { sendTo } = eventBus.actions;

  const machine = model.createMachine({
    id: "moonMachine",
    initial: "idle",
    states: {
      idle: {
        on: {
          HELLO_EARTH: {
            actions: sendTo("earthMachine", {
              type: "HELLO",
              data: { moonTemp: "-183℃" }
            })
          },
          HELLO: {
            actions: (_ctx, evt) => {
              console.log("[moon machine] got HELLO event: ", evt);
            }
          },
          ON_CUSTOM: {
            actions: (_ctx, evt) => {
              console.log("[moon machine] ON_CUSTOM: ", evt);
            }
          }
        }
      }
    }
  });

  return machine;
}
