import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

/**
 * Get the token value from localStorage, check validity with back end
 * then continue.
 * If it did not exist then the user should be redirected to login.
 *
 * Same is true except validity is passed from App.tsx
 */

interface Props extends RouteProps {
  valid: boolean;
}
function ProtectedRoute(props: Props) {
  return props.valid ? (
    <Route {...props}>{props.children}</Route>
  ) : (
    <Redirect to="/login" />
  );
}

export default ProtectedRoute;
