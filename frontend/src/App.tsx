import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./AuthContext";
import "./axios";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AnonRoute from "./components/AnonRoute/AnonRoute";
import Login from "./pages/LoginPage"
import SearchBar from './components/SearchBar/DummySearchBar'
import DummyFeed from './DummyFeed'



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
          <Route exact path="/" component={HomePage}/>
          <Route exact path="/login" render={(props) => {
              return <Login {...props} setAuth={setAuth} />;
            }}
          />
          <ProtectedRoute path="/feed" component={DummyFeed} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
