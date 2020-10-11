import React from "react";
import "./App.css";
import Form from "./components/Form/Form";
import PrivacyForm from "./components/PrivacyForm/PrivacyForm"
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import "./axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/AccountManagement/Register";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ManageAccount from "./pages/ManageAccount/ManageAccount";
import ManageConfirmation from "./pages/ManageAccount/ManageConfirmation";

function App() {
  return (
    //Disregard my router set up, just playing around with routers
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/manage_privacy">Manage Privacy</Link>
            </li>
            <li>
              <Link to="/manage_account">Manage Account</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/recover_password">Forgot Password</Link>
            </li>
          </ul>
        </nav>


        <Switch>
          <Route path="/home">
            <Form title="Enter your details here"> </Form>
          </Route>
          <Route path="/manage_privacy">
            <PrivacyForm title="Manage Privacy"></PrivacyForm>
          </Route>
          <Route path="/manage_account">
            <ManageAccount />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/recover_password">
            <ForgotPasswordPage />
          </Route>
          <Route path="/manage_confirmation">
            <ManageConfirmation />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

/*      <div className="App">
        <Form title="Enter your details here" />
        <MenuButton title="Manage Privacy" destintation="/manage_privacy" />
      </div>*/
/*import ForgotPasswordPage from "./pages/ForgotPasswordPage";
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
}*/

export default App;
