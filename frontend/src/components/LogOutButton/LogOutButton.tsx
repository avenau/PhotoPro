import React from "react";
import Button from "react-bootstrap/Button";
import Nav from 'react-bootstrap/Nav';
import {Redirect} from "react-router-dom";


export default function LogOutButton () {
  const [loggedOut, setLoggedOut] = React.useState(false);

  if (loggedOut) {
    localStorage.removeItem("token");
    localStorage.removeItem("u_id");
    return <Redirect to="/" />
  }

  return (
    <Nav.Link
      onClick={() => {
        setLoggedOut(true);
      }}>
        Log Out
    </Nav.Link>
  )
}
