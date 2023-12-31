import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Editor from "./Editor";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <h1 class="title">Notion clone</h1>
    <p>Add / to show context menu</p>
    <Editor />
  </React.StrictMode>
);
