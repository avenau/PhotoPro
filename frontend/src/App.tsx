import axios from "axios";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import "./axios";
import AnonRoute from "./components/AnonRoute/AnonRoute";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import DoesNotExistPage from "./pages/DoesNotExistPage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ManageAccount from "./pages/ManageAccount/ManageAccount";
import ManageConfirmation from "./pages/ManageAccount/ManageConfirmation";
import PhotoDetails from "./pages/PhotoDetails/PhotoDetails";
import ProfilePage from "./pages/ProfilePage";
import Register from "./pages/Register";
import SearchPage from "./pages/SearchPage";
import UploadPage from "./pages/UploadPage/UploadPage";
import EditPhoto from "./pages/EditPhoto";


interface Props {}

interface State {
  valid: boolean;
  loading: boolean;
}
class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const token = localStorage.getItem("token");
    let loading = true;
    if (token !== null) {
      axios.get(`/verifytoken?token=${token}`).then((response: any) => {
        if (response.data.valid) {
          this.setState({ valid: true, loading: false });
        } else {
          this.setState({ valid: false, loading: false });
        }
      });
    } else {
      loading = false;
    }

    this.state = {
      valid: false,
      loading,
    };
  }

  render() {
    return this.state.loading ? (
      <div>Loading...</div>
    ) : (
      <Router forceRefresh>
        <Switch>
          <AnonRoute
            valid={this.state.valid}
            exact
            path="/login"
            component={LoginPage}
          />
          <Route exact path="/" component={HomePage} />
          <AnonRoute
            valid={this.state.valid}
            exact
            path="/register"
            component={Register}
          />
          <AnonRoute
            exact
            valid={this.state.valid}
            path="/forgotpassword/request"
            component={ForgotPasswordPage}
          />
          <AnonRoute
            exact
            valid={this.state.valid}
            path="/forgotpassword/reset"
            component={ResetPasswordPage}
          />
          <Route
            exact
            path="/forgotpassword/reset"
            component={ResetPasswordPage}
          />
          <Route path="/user/:user_id" component={ProfilePage} />
          <Route path="/search/:type" component={SearchPage} />
          <ProtectedRoute
            valid={this.state.valid}
            exact
            path="/upload"
            component={UploadPage}
          />
          <ProtectedRoute
            valid={this.state.valid}
            exact
            path="/manage_account"
            component={ManageAccount}
          />
          <ProtectedRoute
            valid={this.state.valid}
            exact
            path="/manage_confirmation"
            component={ManageConfirmation}
          />
          <ProtectedRoute
            valid={this.state.valid}
            path="/photo/:photo_id"
            component={PhotoDetails}
          />
          <ProtectedRoute valid={this.state.valid} path="/edit" component={EditPhoto}/>
          <Route path="*" component={DoesNotExistPage} />
          {/* <ProtectedRoute path="/photo/:photo_id" component={DummyFeed} /> */}
        </Switch>
      </Router>
    );
  }
}

export default App;
