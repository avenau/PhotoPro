import React from "react";
import "./App.css";
import Welcome from "./components/Welcome";
import Toolbar from "./components/Toolbar";

function App() {
  return (
    <div className = "App">
      <Toolbar />
      <Welcome />
    </div>
  );
}

export default App;
