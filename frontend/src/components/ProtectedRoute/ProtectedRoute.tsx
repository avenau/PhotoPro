import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import axios from 'axios';

/**
 * Get the token value from localStorage, check validity with back end
 * then continue.
 * If it did not exist then the user should be redirected to login.
 */
function ProtectedRoute(props: RouteProps) {
  const token = localStorage.getItem('token') !== null ? localStorage.getItem('token') : '';
  const [loading, setLoading] = React.useState(true);
  const [valid, setValid] = React.useState(false);

  axios.get(`/verifytoken?token=${token}`).then((response: any) => {
    if (response.data.valid) setValid(true);
    setLoading(false);
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return valid ? <Route {...props} /> : <Redirect to="/login" />;
}

export default ProtectedRoute;
