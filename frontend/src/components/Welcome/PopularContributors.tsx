import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import ContentLoader from "../ContentLoader/ContentLoader";

class PopularContributors extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
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
            noContentMessage="There are currently no popular Contributors"
          />
        </div>
      </Container>
    );
  }
}

export default PopularContributors;
