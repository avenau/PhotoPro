import React, { Component } from "react";
import { Jumbotron } from "react-bootstrap";

class WelcomeHeader extends Component {
  render() {
    return (
      <Jumbotron>
        <h1 style={{ textAlign: "center" }}>Welcome to PhotoPro</h1>
      </Jumbotron>
    );
  }
}

export default WelcomeHeader;
