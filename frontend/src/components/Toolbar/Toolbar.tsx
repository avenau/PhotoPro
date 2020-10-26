import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import Search from "../Search/Search";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import IToolbarState from "./IToolbarState";

interface Props {}

class Toolbar extends React.Component<Props, IToolbarState> {
  render() {
    const nickname = localStorage.getItem("nickname");
    return (
      <Navbar bg="light">
        <Navbar.Brand href="/">PhotoPro</Navbar.Brand>
        <Nav className="mr-auto">
          {nickname === null ? <LoggedOut /> : <LoggedIn nickname={nickname} />}
        </Nav>
        <Search />
      </Navbar>
    );
  }
}

export default Toolbar;
