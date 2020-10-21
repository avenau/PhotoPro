import React from "react";
import axios from "axios";
import { Nav, Navbar } from "react-bootstrap";
import Search from "../Search/Search";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import IToolbarProps from "./IToolbarProps";
import IToolbarState from "./IToolbarState";
import "bootstrap/dist/css/bootstrap.min.css";

class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
  constructor(props: IToolbarProps) {
    super(props);
    let token = !localStorage.getItem("token")
      ? ""
      : localStorage.getItem("token");
    if (!token) token = "";

    this.state = {
      username: "",
      token,
    };
  }

  componentDidMount() {
    if (this.state.token !== "") {
      axios
        .get("/userdetails", {
          params: {
            token: this.state.token,
          },
        })
        .then((res) => {
          this.setState({ username: res.data.nickname });
        });
    }
  }

  render() {
    const { username } = this.state;
    const tool =
      username === "" ? <LoggedOut /> : <LoggedIn username={username} />;
    return (
      <Navbar bg="light">
        <Navbar.Brand href="/">PhotoPro</Navbar.Brand>
        <Nav className="mr-auto">{tool}</Nav>
        <Search />
      </Navbar>
    );
  }
}

export default Toolbar;
