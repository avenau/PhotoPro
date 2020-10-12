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
  return (
      <Router>
        <Switch>
          <AnonRoute exact path="/" component={HomePage}/>
          <AnonRoute exact path="/login" render={(props) => {
              return <Login {...props} />;
            }}
          />
          <ProtectedRoute path="/feed" component={DummyFeed} />
        </Switch>
      </Router>
  );
}

export default App;
