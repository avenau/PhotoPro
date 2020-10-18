import React from 'react';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Redirect } from 'react-router-dom';

function LoggedIn(props: any) {
  const u_id = localStorage.getItem('u_id');
  const redirect = `/user/${u_id}`;

  return (
    <Nav>
      <Nav.Item>
        <Nav.Link
          href="/feed"
        >
          Your Feed
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          href="/purchases"
        >
          Purchases
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          href="/notifications"
        >
          Notifications
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          href={redirect}
        >
          {props.user}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          href="/"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('u_id');
          }}
        >
          Logout
        </Nav.Link>
      </Nav.Item>
      <Nav.Item />
    </Nav>
  );
}

export default LoggedIn;
