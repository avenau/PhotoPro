import React from "react";
import {
  BrowserRouter as Router,
  RouteComponentProps,
  Switch,
  Link,
  Route,
} from "react-router-dom";
import "./App.css";
import "./axios";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ExampleLoginPage from "./pages/Examples/ExampleLoginPage";
import ExamplePageAuth from "./pages/Examples/ExamplePageAuth";
import AnonRoute from "./components/AnonRoute/AnonRoute";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import Register from "./pages/Register";
import DoesNotExistPage from "./pages/DoesNotExistPage";
import ManageAccount from "./pages/ManageAccount/ManageAccount";
import ManageConfirmation from "./pages/ManageAccount/ManageConfirmation";

function App() {
  return (
    <Router>
      <Switch>
        <AnonRoute
          exact
          path="/login"
          render={(props) => {
            return <LoginPage {...props} />;
          }}
        />
        <AnonRoute exact path="/" component={HomePage} />
        <AnonRoute exact path="/register" component={Register} />
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
        <Route
          exact
          path="/forgotpassword/reset"
          component={ResetPasswordPage}
        />
        <Route path="/user/:user_id" component={ProfilePage} />
        <ProtectedRoute path="/manage_account">
          <ManageAccount />
        </ProtectedRoute>
        <ProtectedRoute path="/manage_confirmation">
          <ManageConfirmation />
        </ProtectedRoute>
        {/* TODO: Joe pls reroute this */}
        <ProtectedRoute path="/feed" component={HomePage} />
      </Switch>
    </Router>
  );
}

export default App;
