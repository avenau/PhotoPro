import React from "react";
import "./App.css";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import "./axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/AccountManagement/Register";


function App() {
  return (
    <div className="App">
      <Register/>
      {/* <ForgotPasswordPage /> */}
    </div>
  );
}

export default App;
