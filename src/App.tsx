import Oktopod, { EventPayload } from "oktopod";
import { interpret } from "xstate";
import { createMoonMachine } from "./machines/moon-machine";
import { createEarthMachine } from "./machines/earth-machine";

import "./styles.css";

const eventBus = new Oktopod();

const moonService = interpret(createMoonMachine(eventBus), {
  devTools: true
}).start();
const earthService = interpret(createEarthMachine(eventBus), {
  devTools: true
}).start();

// registration is only needed for machine to machine communication
eventBus.register(moonService);
eventBus.register(earthService);

/**
 * When "some_event" is emitted on the eventBus
 * send "ON_CUSTOM" event to the moon and earth machines
 */
const evt = "some_event";

eventBus.on(evt, moonService, "ON_CUSTOM");
eventBus.on(evt, earthService, "ON_CUSTOM");

//trigger simple function when "some_event" is emitter
eventBus.on(evt, (payload: EventPayload<{ foo: string }>) => {
  console.log("FN ", payload);
});
/**
 * complete documenation
 * https://github.com/ivandotv/oktopod
 */
export default function App() {
  return (
    <div className="App">
      <h4>Hint! Open the console</h4>
      <p>
        <button
          onClick={() => {
            // moon machine will iternally send event to earth machine via event bus
            moonService.send({ type: "HELLO_EARTH" });
          }}
        >
          moon to earth
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            // earth service will internally send event to the moon service via event bus
            earthService.send({ type: "HELLO_MOON" });
          }}
        >
          earth to moon
        </button>
      </p>
      <p>
        <button onClick={() => eventBus.emit(evt, { foo: "bar" })}>
          event bus custom event
        </button>
      </p>
    </div>
  );
}
