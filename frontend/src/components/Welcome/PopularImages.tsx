import React, { Component } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Image
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class PopularImages extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      popularImages: []
    }
  }

  componentDidMount() {
    this.getPopularImagesPaths();
  }

  getPopularImagesPaths() {
    axios.get('/welcome/getPopularImages')
      .then(res => {
        const images = res.data.popular_images;
        this.setState({popularImages: images});
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    //this.getPopularImagesPaths();
    return(
      <div>
        <Container>
          <Row>
            <h3>Popular Images</h3>
          </Row>
        </Container>
        <Container>
          <Row>
            { this.state.popularImages.map((image: string, index: any) =>
            <Col key={index}>
              <Image src={image} fluid/>
            </Col>
            )}
          </Row>
        </Container>
      </div>
    );
  }
}

export default PopularImages;
