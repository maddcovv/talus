import React from "react";
import ReactDOM from "react-dom/client";
// Fonts load from the Google Fonts link in index.html: the variable Archivo
// carries the width axis the Two Track headings use, which the static
// fontsource build does not.
import "@talus/tokens/talus.css";
import "./global.css";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
