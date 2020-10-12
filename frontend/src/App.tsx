import React from "react";
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch,
  Link
} from "react-router-dom";
import "./App.css";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import "./axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/AccountManagement/Register";
import ManageAccount from "./pages/ManageAccount/ManageAccount";
import ManageConfirmation from "./pages/ManageAccount/ManageConfirmation";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ExampleLoginPage from "./pages/Examples/ExampleLoginPage";
import ExamplePage from "./pages/Examples/ExmaplePage";
import ExamplePage2 from "./pages/Examples/ExmaplePage2";
import ExamplePageAuth from "./pages/Examples/ExmaplePageAuth";
import Form from "./components/Form/Form";

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
  /* return (
     //Disregard my router set up, just playing around with routers
     <Router>
       <div>
         <nav>
           <ul>
             <li>
               <Link to="/home">Home</Link>
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
     </Router >
   )*/
  return (
    <AuthProvider value={authDetails!}>

      <Router>
        {/*Temp Nav To Redirect to different pages */}
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
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
          <Route exact path="/example" component={ExamplePage} />
          <Route exact path="/example2" component={ExamplePage2} />
          <Route
            exact
            path="/login"
            render={(props: RouteComponentProps) => {
              return <ExampleLoginPage {...props} setAuth={setAuth} />;
            }}
          />
          <Route path="/home">
            <Form title="Enter your details here"> </Form>
          </Route>
          <ProtectedRoute path="/manage_account">
            <ManageAccount />
          </ProtectedRoute>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/recover_password">
            <ForgotPasswordPage />
          </Route>
          <ProtectedRoute path="/manage_confirmation">
            <ManageConfirmation />
          </ProtectedRoute>
          <ProtectedRoute path="/exampleauth" component={ExamplePageAuth} />

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
