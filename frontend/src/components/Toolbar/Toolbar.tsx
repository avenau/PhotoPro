import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Search from "../Search/Search";

function Toolbar() {
  return (
    <Navbar bg="light">
      <Navbar.Brand href="/">PhotoPro</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Item>
          <Nav.Link href="/register">Create Account</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav.Item>
      </Nav>
      <Form inline>
        <Search />
      </Form>
    </Navbar>
  );
}

export default Toolbar;
