import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

class Showdown extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      imagePaths: []
    }
    this.getStandupImagePaths();
  }

  getStandupImagePaths() {
    axios.get('/showdown/getImages')
      .then(res => {
        const imagePaths = res.data;
        this.setState({ imagePaths });
      })
  }

  render() {
    return (
      <Container className="p-3">
        <Row>
          <h3 style={{"textAlign": "center"}}>Today's PHOTO SHOWDOWN</h3>
        </Row>
        <Container className="p-2">
          <Row>
            <Col>
              <Image src={ this.state.imagePaths.path_one } fluid/>
            </Col>
            <Col xs={2}> <h3> VS </h3> </Col>
            <Col>
              <Image src={ this.state.imagePaths.path_two } fluid/>
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
