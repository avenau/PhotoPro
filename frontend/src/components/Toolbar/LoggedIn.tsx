import React from 'react';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoggedIn() {

  let u_id = localStorage.getItem('u_id');
  let redirect = '/user/:' + u_id;

  return (
    <Nav>
      <Nav.Item>
        <Nav.Link href={redirect}>{u_id}</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          href='/'
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('u_id');
          }}
          >Logout</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default LoggedIn;
