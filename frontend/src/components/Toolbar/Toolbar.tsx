import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Search from '../Search/Search';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Redirect} from "react-router-dom";

function Toolbar() {

  return (
    <Container>
      <Navbar bg="light">
        <Navbar.Brand href="/">PhotoPro</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Item>
            <Nav.Link  href="/register">Create Account</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <LoginOrLogout/>
          </Nav.Item>
          <Nav.Item>
            <Search />
          </Nav.Item>
        </Nav>
      </Navbar>
    </Container>
  );
}

export default Toolbar;

function LoginOrLogout() {
  {/*TODO: This needs to use the secret in the future*/}

  if (localStorage.getItem('token') == null){
    return (
      <Nav.Link href="/login">Login</Nav.Link>
    )
  } else {
    return (
      <Nav.Link
        href='/'
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('u_id');
        }}
        >Logout</Nav.Link>
    )
  }
}
