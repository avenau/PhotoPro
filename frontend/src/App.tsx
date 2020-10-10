import React from "react";
import "./App.css";
/*<<<<<<< HEAD
import Form from "./components/Form/Form";
import PrivacyForm from "./components/PrivacyForm/PrivacyForm"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ManageAccount from "./manageAccount";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/manage_privacy">Manage Privacy</Link>
            </li>
            <li>
              <Link to="/manage_account">Manage Account</Link>
            </li>
          </ul>
        </nav>


        <Switch>
          <Route path="/manage_privacy">
            <PrivacyForm title="Manage Privacy"></PrivacyForm>
          </Route>
          <Route path="/manage_account">
            <ManageAccount></ManageAccount>
          </Route>
          <Route path="/">
            <div className="App">
              <Form title="Enter your details here" />
            </div>
          </Route>
        </Switch>
      </div>
    </Router>

    /*      <div className="App">
            <Form title="Enter your details here" />
            <MenuButton title="Manage Privacy" destintation="/manage_privacy" />
          </div>*/
//=========
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import "./axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/AccountManagement/Register";


function App() {
  return (
    <div className="App">
      <Register />
      <ForgotPasswordPage />
    </div>
  );
}

export default App;
