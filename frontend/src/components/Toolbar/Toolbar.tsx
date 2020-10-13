import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Search from '../Search/Search';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav.Item>
        </Nav>
        <Form inline>
          <Search />
        </Form>
      </Navbar>
    </Container>
  );
}

export default Toolbar;
