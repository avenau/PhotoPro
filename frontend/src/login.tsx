import React from "react";
import "./App.css";
import Jumbotron from "react-bootstrap/Jumbotron"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"


export default class Login extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  handleSubmit(event: any) {
    if (event) {
      event.preventDefault();
    }
    fetch('http://localhost:8001/login', {
      method: 'POST',
      body: JSON.stringify(this.state),
    }).then(response => response.json())
    .then((res) => {
      console.log(res)
    });
    console.log(this.state);
  }

  handleChange(event: any) {
    const id = event.target.id;
    this.setState({ [id]: event.target.value });
    console.log(this.state);
  }

  render() {
    return (
      <div>
      <Container>
        <Jumbotron>
          <h1>Log In to PhotoPro</h1>
        </Jumbotron>
      </Container>
      <Container>
        <Form onSubmit={(e) => this.handleSubmit(e)}>
          <Form.Group as={Row} controlId="loginEmail">
            <Col xs={3}>
              <Form.Label>
                Email
              </Form.Label>
            </Col>
            <Col>
              <Form.Control type="email" placeholder="Enter Email" onChange={(e) => this.handleChange(e)} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="loginPassword">
            <Col xs={3}>
              <Form.Label>
                Password
              </Form.Label>
            </Col>
            <Col>
              <Form.Control type="password" placeholder="Enter Password" onChange={(e) => this.handleChange(e)}/>
            </Col>
          </Form.Group>
          <Row>
            <Col>
              {/* TODO href */}
              <a href="/">Forgot your password? Click here.</a>
            </Col>
            <Col>
            </Col>
            <Col>
              <Button variant="primary" type="submit" size="lg">
                Log In
              </Button>
            </Col>
          </Row>
        </Form>
        {}
      </Container>
      </div>
    );
  }
}

