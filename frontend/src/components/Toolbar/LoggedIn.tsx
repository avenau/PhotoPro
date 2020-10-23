import React from "react";
import Nav from "react-bootstrap/Nav";

interface Props {
  nickname: string;
}

function LoggedIn(props: Props) {
  const { nickname } = props;
  const uid = localStorage.getItem("u_id");
  const profile = `/user/${uid}`;

  return (
    <Nav>
      <Nav.Item>
        <Nav.Link href="/">Feed</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/purchases">Purchases</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/notifications">Notifications</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href={profile}>{nickname}</Nav.Link>
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
      <Nav.Item />
    </Nav>
  );
}

export default LoggedIn;
