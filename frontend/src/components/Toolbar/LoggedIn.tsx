import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { Redirect } from 'react-router-dom';
import IToolbarProps from './IToolbarProps';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoggedIn(props: IToolbarProps) {
  const { username } = props;
  const u_id = localStorage.getItem('u_id');
  const redirect = `/user/${u_id}`;

  return (
    <Nav>
      <Nav.Item>
        <Nav.Link
          href="/feed"
        >
          Feed
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
          {username}
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
