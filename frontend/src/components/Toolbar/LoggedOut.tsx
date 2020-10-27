import React from "react";
import Nav from "react-bootstrap/Nav";

function LoggedOut() {
  return (
    <Nav>
      <Nav.Item>
        <Nav.Link href="/register">Create Account</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/login">Login</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default LoggedOut;
