import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Image
} from 'react-bootstrap';
import logo from '../../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';


class PopularImages extends Component {
  render() {
    return(
      <div>
        <Container>
          <Row>
            <h3>Popular Images</h3>
          </Row>
        </Container>
        <Container>
          <Row>
            <Col>
              <Image src={ logo }/>
            </Col>
            <Col>
              <Image src={ logo }/>
            </Col>
            <Col>
              <Image src={ logo }/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default PopularImages;
