import React from "react";
import Button from "react-bootstrap/Button"
import {RouteProps, Redirect} from "react-router-dom";
import AuthContext from "../../AuthContext"


export default function LogOutButton () {
  const [loggedOut, setLoggedOut] = React.useState(false);
  const user = React.useContext(AuthContext)

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
