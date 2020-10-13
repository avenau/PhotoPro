import React from "react";
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./AuthContext";
import "./axios";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ExampleLoginPage from "./pages/Examples/ExampleLoginPage";
import ExamplePage from "./pages/Examples/ExamplePage";
import ExamplePage2 from "./pages/Examples/ExamplePage2";
import ExamplePageAuth from "./pages/Examples/ExamplePageAuth";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";
import Register from "./pages/Register";

function App() {
  /**
   * Gets the token from localStorage. If token doesn't exist return an empty string (rather than null)
   * setAuthDetails() is used since state is a hook here (functional component)
   */
  const [authDetails, setAuthDetails] = React.useState(
    localStorage.getItem("token") !== null ? localStorage.getItem("token") : ""
  );

  /**
   * Function to update the localStorage and update state
   */
  function setAuth(token: string, u_id: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("u_id", u_id);
    setAuthDetails(token);
  }
  return (
    <AuthProvider value={authDetails!}>
      <Router>
        <Switch>
          <Route
            exact
            path="/login"
            render={(props: RouteComponentProps) => {
              return <ExampleLoginPage {...props} setAuth={setAuth} />;
            }}
          />
          <Route
            exact
            path="/"
            component={HomePage}
          />
          <Route exact path="/register" component={Register} />
          <ProtectedRoute path="/exampleauth" component={ExamplePageAuth} />

          <Route
            exact
            path="/forgotpassword/request"
            component={ForgotPasswordPage}
          />
          <Route
            exact
            path="/forgotpassword/reset"
            component={ResetPasswordPage}
          />
          {/* EXAMPLE LOGIN/REGISTER ROUTES BELOW */}
          {/* <Route
            exact
            path="/login"
            render={(props: RouteComponentProps) => {
              return <LoginPage {...props} setAuth={setAuth} />;
            }}
          />
          <Route
            exact
            path="/register"
            render={(props: RouteComponentProps) => {
              return <RegisterPage {...props} setAuth={setAuth} />;
            }}
          /> */}

          {/* EXAMPLE PAGES WHICH REQUIRE LOGIN TO REACH */}
          {/* <ProtectedRoute exact path="/" component={HomePage} />
          <ProtectedRoute path="/profile/:profile" component={ProfilePage} />
          <ProtectedRoute path="/channel/:channel_id" component={ChannelPage} />
          <ProtectedRoute path="/search/:query_str" component={SearchPage} />
          <ProtectedRoute path="/search" component={SearchPage} /> */}
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
