import React, { Component } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Image
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class PopularContributors extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      contributors: []
    }
  }

  componentDidMount() {
    this.getPopularContributorsPaths();
  }

  getPopularContributorsPaths() {
    let token = localStorage.getItem('token');
    axios.get('/welcome/popularcontributors', {
        params: {
          token: token
        }
      })
      .then(res => {
        const contributors = res.data.contributors;
        this.setState({contributors:contributors});
      })
  }


  render() {
    return(
      <div>
        <Container>
          <Row>
            <h3>Popular Artists</h3>
          </Row>
        </Container>
        <Container className="p-2">
          {/*
            Using state.x.map:
            Adaptive mapping depending on the amount
            of images returned
          */}
          <Row>
            { this.state.contributors.map((contributor: string, index: any) =>
            <Col key={index}>
              <Image src={contributor} fluid/>
            </Col>
            )}
          </Row>
        </Container>
      </div>
    );
  }
}

export default PopularContributors;
