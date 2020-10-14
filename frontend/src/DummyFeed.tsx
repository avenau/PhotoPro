import React from "react";
import Container from "react-bootstrap/Container"
import { RouteProps } from "react-router-dom";
import LogOutButton from "./components/LogOutButton/LogOutButton"
import Toolbar from "./components/Toolbar/Toolbar";

export default function DummyFeed(props: RouteProps) {
  const user = localStorage.getItem("token");
  return (
    <div>
      <Toolbar />
      <Container>
        <h1>Welcome {user}. This is the dummy feed (needs to be changed to the actual feed).
    Anon pages (e.g. /register, /login, /forgotpassword/request) are inaccessible without logging out
    </h1>
        <LogOutButton />
      </Container>
    </div>
  );
}