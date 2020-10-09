import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

// NOTE: This is a Dummy Placeholder - Joe 9/10/20
class Search extends Component {
  render() {
    return (
      <Container fluid>
        <Form>
          <Form.Control placeholder="Search" className="mr-sm-2"/>
          <Button variant="outline-success">Search</Button>
        </Form>
      </Container>
    );
  }
}

export default Search
