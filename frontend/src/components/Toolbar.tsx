import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';

function Toolbar() {
  return (
    <Container className="p-3">
      <ButtonToolbar aria-label="Toolbar buttons">
        <ButtonGroup className="mr-2" aria-label="First group">
          <Button>Create an account</Button>
        </ButtonGroup>
        <ButtonGroup className="mr-2" aria-label="Second group">
          <Button>Login</Button>
        </ButtonGroup>
      </ButtonToolbar>
    </Container>
  );
}

export default Toolbar;
