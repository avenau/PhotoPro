import React, { Component } from 'react';
import {
  Container,
  Jumbotron,
  Row,
  Col,
  Image
} from 'react-bootstrap';
import logo from '../../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

class WelcomeHeader extends Component {
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col sm={2}>
            <Row>
              <p>Yesterday's Showdown Winner:</p>
            </Row>
            <Row>
              <Image src={logo}/>
            </Row>
            </Col>
            <Col sm={10}>
              <Jumbotron>
                <h1 style={{textAlign: "center"}}>Welcome to PhotoPro</h1>
              </Jumbotron>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default WelcomeHeader;
