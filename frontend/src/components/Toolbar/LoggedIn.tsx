import React, { useEffect } from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import { render } from "@testing-library/react";

interface Props {
  nickname: string;
  credits?: number | "...";
}

export default class LoggedIn extends React.Component<Props> {
  render() {
    const uid = localStorage.getItem("u_id");
    const profile = `/user/${uid}`;
    return (
      <Nav>
        <Nav.Item>
          <Nav.Link href="/">Feed</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/purchases">
            Purchases | Credits: {this.props.credits}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/notifications">Notifications</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href={profile}>{this.props.nickname}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            href="/"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("nickname");
              localStorage.removeItem("u_id");
            }}
          >
            Logout
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link></Nav.Link>
        </Nav.Item>
        <Nav.Item />
      </Nav>
    );
  }
}
