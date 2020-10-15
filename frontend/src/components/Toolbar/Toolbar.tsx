import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Search from '../Search/Search';
import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Redirect} from "react-router-dom";


function IsLoggedIn(props: any) {
  let token = props.token;
  return token == null ? <LoggedOut/> : <LoggedIn/>;
}


function Toolbar() {
    let token = localStorage.getItem('token');
    return (
      <Container>
        <Navbar bg="light">
          <Navbar.Brand href="/">PhotoPro</Navbar.Brand>
          <Nav className="mr-auto">
            <IsLoggedIn token={token} />
            <Nav.Item>
              <Search />
            </Nav.Item>
          </Nav>
        </Navbar>
      </Container>
    );
}

export default Toolbar;
