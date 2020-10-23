import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

/**
 * Route component to redirect logged in users away from "anon user" pages such
 * as log in, sign up, and the default landing page.
 */

interface Props extends RouteProps {
  valid: boolean;
}

export default function AnonRoute(props: Props) {
  return props.valid ? <Redirect to="/" /> : <Route {...props} />;
}
