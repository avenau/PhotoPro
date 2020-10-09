import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import image1 from '../../static/apple.png'
import image2 from '../../static/banana.png'
import 'bootstrap/dist/css/bootstrap.min.css';

class Showdown extends Component {
  render() {
    return (
      <Container className="p-3">
        <Row>
          <h3>Today's PHOTO SHOWDOWN</h3>
        </Row>
        <Container className="p-2">
          <Row>
            <Col>
              <Image src={ image1 } fluid/>
            </Col>
            <Col xs={2}> <h3> VS </h3> </Col>
            <Col>
              <Image src={ image2 } fluid/>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="success">Apple</Button>
            </Col>
            <Col xs={2}>
            </Col>
            <Col>
              <Button variant="success">Banana</Button>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

export default Showdown;
