import React, { Component } from "react";
import axios from "axios";
import ContentLoader from "../ContentLoader/ContentLoader";
import Container from "react-bootstrap/Container"

class PopularContributors extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.checkContributors();
  }

  checkContributors() {
    axios.get("/");
  }

  render() {
    return (
      
      <Container>
        <h3>Popular contributors</h3>

        <div style={{ display: "flex", justifyContent: "left" }}>
          <ContentLoader
            query=""
            route="/welcome/popularcontributors"
            type="artist"
          />
        </div>
      </Container>
    );
  }
}

export default PopularContributors;
