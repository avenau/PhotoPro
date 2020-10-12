import React from "react";
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import {RouteProps, Redirect} from "react-router-dom";
import AuthContext from "./AuthContext"
import LogOutButton from "./components/LogOutButton/LogOutButton"

export default function DummyFeed (props: RouteProps) {
  const user = localStorage.getItem("token");
  return (
    <Container>
    <h1>Welcome {user}. This is the dummy feed (needs to be changed to the actual feed).</h1>
    <LogOutButton />
    </Container>
  );
}