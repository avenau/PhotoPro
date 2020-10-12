import React from "react";
import { Redirect, Route, RouteProps, RouteChildrenProps } from "react-router-dom";
import AuthContext from "../../AuthContext";


/**
 * Route component to redirect logged in users away from "anon user" pages such 
 * as log in, sign up, and the default landing page.
 */
export default function AnonRoute(props: RouteProps) {
  /**
 * Get the token value from localStorage, if it exists then continue.
 * If it did not exist then the user should be redirected to login.
 *
 * TODO
 * Could be a good idea to check whether the token is valid with the backend
 * rather than just checking its existence
 */
  const token = localStorage.getItem("token") !== null ? localStorage.getItem("token") : "";
  if (token) {
    return <Redirect to="/feed" />;
  }
  return <Route {...props} />;
}


