import React, { Component } from "react";
import ContentLoader from "../ContentLoader/ContentLoader";

class PopularContributors extends Component {
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
