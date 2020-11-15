import React, { Component } from "react";
import { Container } from "react-bootstrap";
import ContentLoader from "../ContentLoader/ContentLoader";

interface Props {
  refreshCredits: () => void;
}

class PopularImages extends Component<Props> {
  render() {
    // this.getPopularImagesPaths();
    return (
      <div>
        <Container>
          <h3>Popular images</h3>
          <ContentLoader
            query=""
            route="/welcome/getPopularImages"
            type="photo"
            popular
            refreshCredits={this.props.refreshCredits}
            noContentMessage="There are currently no Popular Images. Try liking more photos"
          />
        </Container>
      </div>
    );
  }
}

export default PopularImages;
