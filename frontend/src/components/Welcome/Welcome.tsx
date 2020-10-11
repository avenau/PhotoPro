import React, { Component } from 'react';
import {
  Container,
  Jumbotron,
  Row,
  Col,
  Image
} from 'react-bootstrap';
import logo from '../../logo.svg';
import contributor1 from '../../static/contributor1.png';
import contributor2 from '../../static/contributor2.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import Showdown from '../Showdown/Showdown';



class Welcome extends Component {
  render() {
    return (
      <div>
        <Header />
        <Showdown />
        <PopularArtists />
        <PopularImages />
      </div>
    );
  }
}

class Header extends Component {
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

class PopularArtists extends Component {
  render() {
    return(
      <div>
        <Container>
          <Row>
            <h3>Popular Artists</h3>
          </Row>
        </Container>
        <Container className="p-2">
          <Row>
            <Col>
              <Image src={ contributor1 }/>
            </Col>
            <Col>
              <Image src={ contributor2 }/>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

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

export default Welcome;
