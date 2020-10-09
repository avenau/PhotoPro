import React from "react";
import "./App.css";
import Toolbar from "./components/Toolbar";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className = "App">
      <Toolbar />
      <HomePage />
    </div>
  );
}

export default App;
