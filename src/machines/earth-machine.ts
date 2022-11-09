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

export function createEarthMachine(eventBus: Oktopod) {
  const { sendTo } = eventBus.actions;

  const machine = model.createMachine({
    id: "earthMachine",
    initial: "idle",
    states: {
      idle: {
        on: {
          HELLO_MOON: {
            actions: sendTo(
              (_ctx, _evt) => {
                return "moonMachine";
              },
              (_ctx, _evt) => {
                return {
                  type: "HELLO",
                  data: { earthTemp: "46℃" }
                };
              }
            )
          },
          HELLO: {
            actions: (_ctx, evt) => {
              console.log("[earth machine] got HELLO event: ", evt);
            }
          },
          ON_CUSTOM: {
            actions: (_ctx, evt) => {
              console.log("[earth machine] ON_CUSTOM: ", evt);
            }
          }
        }
      }
    }
  });

  return machine;
}
