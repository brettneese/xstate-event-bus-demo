import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import App from "./App";
import { inspect } from "@xstate/inspect";

inspect({
  iframe: false
});

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
