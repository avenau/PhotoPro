import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

function Welcome() {
  return (
    <Container classname="p-3">
      <Row>
      <Col sm={4}>
        <Row>
          <h3>Yesterday's Showdown Winner</h3>
        </Row>
        <Row>
          {/*  Update this to pull from the database */}
          <img src={Logo} alt="Photo of the week"/>
        </Row>
      </Col>
      <Col sm={8}>
        <Jumbotron>
          <h1 align='center'>Welcome to PhotoPro</h1>
        </Jumbotron>
      </Col>
      </Row>
    </Container>
  );
}

export default Welcome;
