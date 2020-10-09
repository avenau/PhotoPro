import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from '../logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

class Welcome extends Component {
  render() {
    return (
      <Container>
        <Row>
        <Col sm={2}>
          <Row>
            <h3>Yesterday's Showdown Winner</h3>
          </Row>
          <Row>
            {/*  Update this to pull from the database */}
            <img src={logo} alt="Logo" />
          </Row>
        </Col>
        <Col sm={10}>
          <Jumbotron>
            <h1 style={{textAlign: "center"}}>Welcome to PhotoPro</h1>
          </Jumbotron>
        </Col>
        </Row>
      </Container>
    );
  }
}

export default Welcome;
