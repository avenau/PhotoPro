import React from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Search from "../Search/Search";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";
import "bootstrap/dist/css/bootstrap.min.css";

function IsLoggedIn(props: any) {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState("");

  axios.get(`/verifytoken?token=${props.token}`).then((res: any) => {
    if (res.data.valid) {
      setLoggedIn(true);
      axios
        .get("/userDetailsWithToken", { params: { token: props.token } })
        .then((res: any) => {
          setUsername(res.data.nickname);
        });
    }
  });
  return loggedIn === true ? <LoggedIn user={username} /> : <LoggedOut />;
}

function Toolbar() {
  let token = localStorage.getItem("token");
  // Convert to empty string if null token
  token = token == null ? "" : token;

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
