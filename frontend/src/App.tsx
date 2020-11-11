import axios from "axios";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import "./axios";
import AnonRoute from "./components/AnonRoute/AnonRoute";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import DoesNotExistPage from "./pages/DoesNotExistPage";
import Toolbar from "./components/Toolbar/Toolbar";
import EditPhoto from "./pages/EditPhoto";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ManageAccount from "./pages/ManageAccount/ManageAccount";
// import ManageConfirmation from "./pages/ManageAccount/ManageConfirmation";
import PhotoDetails from "./pages/PhotoDetails/PhotoDetails";
import ProfilePage from "./pages/ProfilePage";
import BuyCreditsPage from "./pages/Purchases/BuyCreditsPage";
import PurchasesPage from "./pages/Purchases/PurchasesPage";
import RefundCreditsPage from "./pages/Purchases/RefundsCreditsPage";
import Register from "./pages/Register";
import SearchPage from "./pages/SearchPage/SearchPage";
import UploadPage from "./pages/UploadPage/UploadPage";
import ManageAlbum from "./pages/ManageAlbum/ManageAlbum";
import AlbumDetails from "./pages/AlbumDetails/AlbumDetails";
import CollectionDetails from "./pages/CollectionDetails/CollectionDetails";

interface Props {}

interface State {
  valid: boolean;
  loading: boolean;
  credits: number | "...";
}
class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const token = localStorage.getItem("token");
    let loading = true;
    if (token === null) {
      loading = false;
    }

    this.state = {
      valid: false,
      loading,
      credits: "...",
    };
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token !== null) {
      axios.get(`/verifytoken?token=${token}`).then((response: any) => {
        if (response.data.valid) {
          this.setState({ valid: true, loading: false });
        } else {
          this.setState({ valid: false, loading: false });
        }
      });
      axios
        .get("/user/credits", {
          params: {
            token,
          },
        })
        .then((res) => {
          if (this.state.credits != res.data.credits) {
            this.setState({ credits: res.data.credits });
          }
        })
        .catch(() => {});
    }
  }

  refreshCredits = () => {
    const token = localStorage.getItem("token");
    if (this.state.valid) {
      axios
        .get("/user/credits", {
          params: {
            token,
          },
        })
        .then((res) => {
          this.setState({ credits: res.data.credits });
          console.log(res.data.credits);
        })
        .catch(() => {});
    }
  };

  render() {
    return this.state.loading ? (
      <div>Loading...</div>
    ) : (
      <Router forceRefresh>
        <Toolbar credits={this.state.credits} />
        <Switch>
          <AnonRoute
            valid={this.state.valid}
            exact
            path="/login"
            component={LoginPage}
          />
          <Route exact path="/">
            <HomePage />
          </Route>
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
          <Route path="/user/:user_id">
            {" "}
            <ProfilePage refreshCredits={this.refreshCredits} />
          </Route>
          <Route path="/search/:type">
            <SearchPage refreshCredits={this.refreshCredits} />
          </Route>
          {/* component={SearchPage} /> */}

          <Route valid={this.state.valid} path="/photo/:photo_id">
            <PhotoDetails refreshCredits={this.refreshCredits} />
          </Route>
          <ProtectedRoute
            valid={this.state.valid}
            exact
            path="/album/manage/:album_id"
            component={ManageAlbum}
          />
          <ProtectedRoute
            valid={this.state.valid}
            exact
            path="/album/:album_id"
            component={AlbumDetails}
          />
          <Route
            path="/collection/:collection_id"
            component={CollectionDetails}
          />
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
            path="/edit/:photo_id"
            component={EditPhoto}
          />
          <ProtectedRoute
            valid={this.state.valid}
            exact
            path="/purchases"
            component={PurchasesPage}
          />
          <ProtectedRoute
            valid={this.state.valid}
            exact
            path="/purchases/buycredits"
            component={BuyCreditsPage}
          />
          <ProtectedRoute
            valid={this.state.valid}
            exact
            path="/purchases/refundcredits"
            component={RefundCreditsPage}
          />
          <Route path="*" component={DoesNotExistPage} />
          {/* <ProtectedRoute path="/photo/:photo_id" component={DummyFeed} /> */}
        </Switch>
      </Router>
    );
  }
}

export default App;
