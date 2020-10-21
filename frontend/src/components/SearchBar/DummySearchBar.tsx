import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';

class SearchBar extends React.Component {
  render() {
    return (
      <Container>
        <Image src="https://iiif.actacroatica.com/fcgi-bin/iipsrv.fcgi?IIIF=svJer/1906/SVJER1906_0168.tif/1313,1204,91,110/,200/0/default.jpg" rounded />
        <Form>
          <Row>
            <Col xs={2}>
              <Form.Group controlId="selectSearchType">
                <Form.Control as="select" custom>
                  <option>Photos</option>
                  <option>Collections</option>
                  <option>Albums</option>
                  <option>Users</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col xs={4}>
              <Form.Control type="text" placeholder="Search for photos" />
            </Col>
            <Col xs={1}>
              <Button type="submit">Search</Button>
            </Col>
            <Col xs={1} />
            <Col xs={2}>
              <Form.Control type="number" placeholder="Min. price" />
            </Col>
            <Col xs={2}>
              <Form.Control type="number" placeholder="Max. price" />
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}

export default SearchBar;
