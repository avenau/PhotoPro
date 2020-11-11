import React, { Component } from "react";
import axios from "axios";
import ContentLoader from "../ContentLoader/ContentLoader";

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
      <div style={{ padding: "0% 5%" }}>
        <h3>Popular contributors</h3>

        <div style={{ display: "flex", justifyContent: "left" }}>
          <ContentLoader
            query=""
            route="/welcome/popularcontributors"
            type="artist"
          />
        </div>
      </div>
    );
  }
}

export default PopularContributors;
