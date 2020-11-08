import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ContentLoader from '../ContentLoader/ContentLoader';
import { Container } from 'react-bootstrap';

class PopularContributors extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      contributors: [],
    };
  }

  componentDidMount() {
    this.getPopularContributorsPaths();
  }

  getPopularContributorsPaths() {
    const token = localStorage.getItem('token');
    axios.get('/welcome/popularcontributors', {
      params: {
        token,
      },
    })
      .then((res) => {
        const { contributors } = res.data;
        this.setState({ contributors });
      });
  }

  render() {
    return (
      <Container>
      <h3>Popular contributors</h3>

      <div style={{display:'flex', justifyContent: 'left'}}>
      <ContentLoader
        query=""
        route="/welcome/popularcontributors"
        type="artist"/>
      </div>
      </Container>
    );
  }
}

export default PopularContributors;
