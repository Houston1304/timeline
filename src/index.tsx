import React from "react";
import ReactDOM from "react-dom/client";
import TimelineBlock from "./components/TimelineBlock";
import "./styles/main.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <TimelineBlock />
  </React.StrictMode>
);
