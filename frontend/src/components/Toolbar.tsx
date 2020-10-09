import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Search from './Search/Search';
import 'bootstrap/dist/css/bootstrap.min.css';

function Toolbar() {
  return (
    <Container>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">PhotoPro</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link>Create an account</Nav.Link>
          <Nav.Link>Login</Nav.Link>
        </Nav>
        <Form inline>
          <Search />
        </Form>
      </Navbar>
    </Container>
  );
}

export default Toolbar;
