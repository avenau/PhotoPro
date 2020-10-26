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
import LoginPage from "./pages/LoginPage/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ForgotPassword/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import Register from "./pages/Register";
import DoesNotExistPage from "./pages/DoesNotExistPage";
import ManageAccount from "./pages/ManageAccount/ManageAccount";
import ManageConfirmation from "./pages/ManageAccount/ManageConfirmation";
import PhotoDetails from "./pages/PhotoDetails/PhotoDetails";
import UploadPage from "./pages/UploadPage/UploadPage";
import PurchasesPage from "./pages/Purchases/PurchasesPage";
import BuyCreditsPage from "./pages/Purchases/BuyCreditsPage";
import RefundCreditsPage from "./pages/Purchases/RefundsCreditsPage";

function App() {
  return (
    <Router forceRefresh>
      <Switch>
        <AnonRoute exact path="/login" component={LoginPage} />
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
        <Route
          exact
          path="/forgotpassword/reset"
          component={ResetPasswordPage}
        />
        <Route path="/user/:user_id" component={ProfilePage} />
        <Route path="/search/:type" component={SearchPage} />
        <ProtectedRoute exact path="/purchases" component={PurchasesPage} />
        <ProtectedRoute
          exact
          path="/purchases/buycredits"
          component={BuyCreditsPage}
        />
        <ProtectedRoute
          exact
          path="/purchases/refundcredits"
          component={RefundCreditsPage}
        />
        <ProtectedRoute exact path="/upload" component={UploadPage} />
        <ProtectedRoute path="/manage_account" component={ManageAccount} />
        <ProtectedRoute
          path="/manage_confirmation"
          component={ManageConfirmation}
        />
        <ProtectedRoute path="/feed" component={HomePage} />
        <ProtectedRoute path="/photo/:photo_id" component={PhotoDetails} />
        <Route path="*" component={DoesNotExistPage} />
        {/*<ProtectedRoute path="/photo/:photo_id" component={DummyFeed} />*/}
      </Switch>
    </Router>
  );
}

export default App;
