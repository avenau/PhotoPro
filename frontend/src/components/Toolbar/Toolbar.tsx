import React from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Search from '../Search/Search';
import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Redirect} from "react-router-dom";


function IsLoggedIn(props: any) {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [uId, setUId] = React.useState('No User');

  // Make sure if token is null we send an empty string
  let token = props.token == null ? "" : props.token;
  axios.post('/verifytoken', {token})
    .then((response: any) => {
      if (response.data.valid){
        setLoggedIn(true);
        let u_id = localStorage.getItem('u_id');
        setUId(u_id == null ? '' : u_id);
      }
    });
  return loggedIn == true ? <LoggedIn user={uId}/> : <LoggedOut/>;
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
