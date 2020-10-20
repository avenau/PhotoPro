import React from "react";
import {
  BrowserRouter as Router,
  RouteComponentProps,
  Switch,
  Route,
} from "react-router-dom";
import "./App.css";
import "./axios";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AnonRoute from "./components/AnonRoute/AnonRoute";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import Register from "./pages/Register";
import DoesNotExistPage from "./pages/DoesNotExistPage";
import ManageAccount from "./pages/ManageAccount/ManageAccount";
import ManageConfirmation from "./pages/ManageAccount/ManageConfirmation";
import UploadPage from "./pages/UploadPage/UploadPage";

function App() {
  return (
    <Router forceRefresh>
      <Switch>
        <AnonRoute
          exact
          path="/login"
          render={(props) => <LoginPage {...props} />}
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
          render={(props: RouteComponentProps) => <LoginPage {...props} />}
        />
        <Route
          exact
          path="/forgotpassword/reset"
          component={ResetPasswordPage}
        />
        <Route path="/user/:user_id" component={ProfilePage} />
        <Route path="/search/:type" component={SearchPage} />
        <ProtectedRoute exact path="/upload" component={UploadPage} />
        <ProtectedRoute path="/manage_account">
          <ManageAccount />
        </ProtectedRoute>
        <ProtectedRoute path="/manage_confirmation">
          <ManageConfirmation />
        </ProtectedRoute>
        <ProtectedRoute path="/feed" component={HomePage} />
        <Route path="*" component={DoesNotExistPage} />
      </Switch>
    </Router>
  );
}

export default App;
