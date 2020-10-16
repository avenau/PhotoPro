import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import axios from "axios";

/**
 * Route component to redirect logged in users away from "anon user" pages such
 * as log in, sign up, and the default landing page.
 */
export default function AnonRoute(props: RouteProps) {
  const token =
    localStorage.getItem("token") !== null ? localStorage.getItem("token") : "";
  const [loading, setLoading] = React.useState(true);
  const [valid, setValid] = React.useState(false);

  axios.get(`/verifytoken?token=${token}`).then((response: any) => {
    if (response.data.valid) setValid(true);
    setLoading(false);
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return valid ? <Redirect to="/feed" /> : <Route {...props} />;
}
