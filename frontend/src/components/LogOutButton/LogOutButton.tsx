import React from "react";
import Button from "react-bootstrap/Button"
import {Redirect} from "react-router-dom";


export default function LogOutButton () {
  const [loggedOut, setLoggedOut] = React.useState(false);

  if (loggedOut) {
    localStorage.removeItem("token");
    localStorage.removeItem("u_id");
    return <Redirect to="/" />
  }

  return (
    <Button variant="primary" 
      onClick={() => {
        setLoggedOut(true);
      }}>
        Log Out
    </Button>
  )
}
