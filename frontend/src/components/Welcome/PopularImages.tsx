import React, { Component } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ContentLoader from "../ContentLoader/ContentLoader";

interface Props {
  refreshCredits: () => void;
}

class PopularImages extends Component<Props, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      popularImages: [],
    };
  }

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
          />
        </Container>
      </div>
    );
  }
}

export default PopularImages;
