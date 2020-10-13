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
import AnonRoute from "./components/AnonRoute/AnonRoute";
import LoginPage from "./pages/LoginPage"
import SearchBar from './components/SearchBar/DummySearchBar'
import DummyFeed from './DummyFeed'
import ExampleLoginPage from "./pages/Examples/ExampleLoginPage";
import ExamplePage from "./pages/Examples/ExamplePage";
import ExamplePage2 from "./pages/Examples/ExamplePage2";
import ExamplePageAuth from "./pages/Examples/ExamplePageAuth";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";
import Register from "./pages/Register";



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
              return <LoginPage {...props}/>;
            }}
          />
          <ProtectedRoute path="/feed" component={DummyFeed} />
        </Switch>
      </Router>
  );
}

export default App;
