import React, { Component } from 'react';
import axios from 'axios';
import {
  Container,
  Jumbotron,
  Row,
  Col,
  Image,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface WelcomeHeaderState {
    winnerPath: string
}

class WelcomeHeader extends Component<{}, WelcomeHeaderState> {
  constructor(props:any){
    super(props);
    this.state = {
      winnerPath: '',
    }
  }

  componentDidMount(){
      axios.get('/showdown/getwinner')
      .then((res) => {
        this.setState ({
          winnerPath: res.data.path,
        });
      });
  }

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col sm={2}>
              <Row>
                <p>Yesterday&apos;s Showdown Winner:</p>
              </Row>
              <Row>
                <Image src={this.state.winnerPath} />
              </Row>
            </Col>
            <Col sm={10}>
              <Jumbotron>
                <h1 style={{ textAlign: 'center' }}>Welcome to PhotoPro</h1>
              </Jumbotron>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default WelcomeHeader;
