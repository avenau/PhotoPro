import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import AuthContext from "../../AuthContext";

/**
 * Get the token value from localStorage, if it exists then continue.
 * If it did not exist then the user should be redirected to login.
 *
 * TODO
 * Could be a good idea to check whether the token is valid with the backend
 * rather than just checking its existence
 */
function ProtectedRoute(props: RouteProps) {
  const token = React.useContext(AuthContext);
  console.log(token);
  if (!token) {
    return <Redirect to="/login" />;
  }
  return <Route {...props} />;
}

export default ProtectedRoute;
