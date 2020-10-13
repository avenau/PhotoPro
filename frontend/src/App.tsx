import React from "react";
import {
  BrowserRouter as Router,
  RouteComponentProps,
  Switch,
  Link
} from "react-router-dom";
import "./App.css";
import "./axios";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AnonRoute from "./components/AnonRoute/AnonRoute";
import LoginPage from "./pages/LoginPage"
import DummyFeed from './DummyFeed'
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";
import Register from "./pages/Register";

import "bootstrap/dist/css/bootstrap.min.css";
import ManageAccount from "./pages/ManageAccount/ManageAccount";
import ManageConfirmation from "./pages/ManageAccount/ManageConfirmation";


function App() {
  return (
    <Router>
      <Switch>
        <AnonRoute exact path="/login" render={(props) => {
          return <LoginPage {...props} />;
        }}
        />
        <AnonRoute
          exact
          path="/"
          component={HomePage}
        />
        <AnonRoute
          exact
          path="/register"
          component={Register}
        />
        <AnonRoute
          exact
          path="/forgotpassword/request"
          component={ForgotPasswordPage}
        />
        <AnonRoute
          exact
          path="/forgotpassword/reset"
          component={ResetPasswordPage}
        />
        <AnonRoute
          exact
          path="/login"
          render={(props: RouteComponentProps) => {
            return <LoginPage {...props} />;
          }}
        />
        <ProtectedRoute path="/manage_account">
          <ManageAccount />
        </ProtectedRoute>
        <ProtectedRoute path="/manage_confirmation">
          <ManageConfirmation />
        </ProtectedRoute>
        {/* TODO: Joe pls reroute this */}
        <ProtectedRoute path="/feed" component={DummyFeed} />
      </Switch>
    </Router >
  );
}

export default App;
